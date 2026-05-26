import type { Plugin, ViteDevServer } from "vite";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Self-healing route regeneration.
 *
 * TanStack Router auto-generates `src/routeTree.gen.ts`. In rare cases
 * (stale cache, interrupted writes, concurrent renames) the file ends up
 * with the same `const FooRoute = ...` declared twice, which crashes the
 * bundler with:
 *     The symbol 'FooRoute' has already been declared
 * and the preview goes blank.
 *
 * This plugin:
 *   1. Scans `src/routeTree.gen.ts` for duplicate top-level `const`
 *      declarations on startup, on every dev request (throttled), and
 *      whenever the file changes on disk.
 *   2. When duplicates are found, deletes the file, clears Vite's dep
 *      cache, and exits the Vite process. The dev-server supervisor
 *      respawns Vite, which performs a full clean rebuild — including
 *      regenerating `routeTree.gen.ts` from scratch via the TanStack
 *      Router plugin — instead of letting the user stare at a blank
 *      screen.
 */
export function routeTreeHealer(): Plugin {
  const ROUTE_TREE_REL = "src/routeTree.gen.ts";
  let rootDir = process.cwd();
  let server: ViteDevServer | null = null;
  let healing = false;
  let lastCheck = 0;

  const findDuplicates = (src: string): string[] => {
    const seen = new Set<string>();
    const dupes = new Set<string>();
    // routeTree.gen.ts emits its declarations at column 0.
    const re = /^const\s+([A-Za-z_$][\w$]*)\s*=/gm;
    let m: RegExpExecArray | null;
    while ((m = re.exec(src))) {
      const name = m[1];
      if (seen.has(name)) dupes.add(name);
      else seen.add(name);
    }
    return [...dupes];
  };

  const heal = async (reason: string) => {
    if (healing) return;
    healing = true;
    const abs = path.join(rootDir, ROUTE_TREE_REL);
    // eslint-disable-next-line no-console
    console.warn(
      `\n[route-tree-healer] ${reason}\n` +
        `[route-tree-healer] Deleting ${ROUTE_TREE_REL}, clearing Vite cache, ` +
        `and exiting so the dev server can restart cleanly.\n`,
    );
    try {
      await fs.rm(abs, { force: true });
      await fs.rm(path.join(rootDir, "node_modules/.vite"), {
        recursive: true,
        force: true,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[route-tree-healer] cleanup failed:", err);
    }
    // Ask the browser to reload after the supervisor brings Vite back up.
    if (server) {
      try {
        server.ws.send({ type: "full-reload", path: "*" });
      } catch {
        /* ignore */
      }
    }
    // Exit so the dev-server supervisor performs a clean restart and the
    // TanStack Router plugin regenerates the route tree from scratch.
    setTimeout(() => process.exit(1), 50);
  };

  const check = async (reason: string, throttleMs = 0) => {
    if (healing) return;
    if (throttleMs && Date.now() - lastCheck < throttleMs) return;
    lastCheck = Date.now();
    const abs = path.join(rootDir, ROUTE_TREE_REL);
    let src: string;
    try {
      src = await fs.readFile(abs, "utf8");
    } catch {
      return; // not generated yet — router plugin will create it
    }
    const dupes = findDuplicates(src);
    if (dupes.length) {
      await heal(`${reason}: duplicate symbol(s) ${dupes.join(", ")}`);
    }
  };

  return {
    name: "lovable:route-tree-healer",
    apply: "serve",
    configResolved(cfg) {
      rootDir = cfg.root;
    },
    async configureServer(s) {
      server = s;
      // 1. Startup scan — catches duplicates left over from a previous crash.
      await check("startup scan");

      // 2. Native fs.watch on routeTree.gen.ts. The TanStack Router plugin
      //    typically excludes its own output from chokidar to avoid reload
      //    loops, so we can't rely on Vite's watcher here.
      const arm = async () => {
        try {
          const { watch } = await import("node:fs");
          const abs = path.join(rootDir, ROUTE_TREE_REL);
          watch(abs, { persistent: false }, () => {
            void check("fs.watch event");
          });
        } catch {
          setTimeout(() => void arm(), 500);
        }
      };
      void arm();

      // 3. Belt-and-braces request-time scan (throttled to 1s).
      s.middlewares.use((_req, _res, next) => {
        void check("request-time scan", 1000);
        next();
      });
    },
  };
}
