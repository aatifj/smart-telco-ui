import type { Plugin, ViteDevServer } from "vite";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Self-healing route regeneration.
 *
 * TanStack Router auto-generates `src/routeTree.gen.ts`. In rare cases (stale
 * cache, interrupted writes, concurrent renames) the file ends up with the
 * same `const FooRoute = ...` declared twice, which crashes the bundler with
 *   "The symbol 'FooRoute' has already been declared"
 * and the preview goes blank.
 *
 * This plugin scans the generated file on dev server start AND whenever it
 * changes, detects duplicate top-level `const` declarations, and—when it
 * finds any—deletes the file so the TanStack Router plugin regenerates it
 * cleanly from the route filesystem. We also nuke Vite's dep cache so the
 * next request triggers a fresh full rebuild instead of serving stale chunks.
 */
export function routeTreeHealer(): Plugin {
  const ROUTE_TREE_REL = "src/routeTree.gen.ts";
  let rootDir = process.cwd();
  let server: ViteDevServer | null = null;
  let healing = false;

  const findDuplicates = (src: string): string[] => {
    const seen = new Set<string>();
    const dupes = new Set<string>();
    // Match top-level `const Foo = ` (route tree only emits these at column 0).
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
    try {
      const abs = path.join(rootDir, ROUTE_TREE_REL);
      // eslint-disable-next-line no-console
      console.warn(
        `[route-tree-healer] ${reason} — deleting ${ROUTE_TREE_REL} and forcing a clean rebuild.`,
      );
      await fs.rm(abs, { force: true });
      // Drop Vite's dep cache so the next request triggers a full rebuild
      // instead of serving the cached broken module graph.
      await fs.rm(path.join(rootDir, "node_modules/.vite"), {
        recursive: true,
        force: true,
      });
      if (server) {
        server.ws.send({ type: "full-reload", path: "*" });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[route-tree-healer] failed to self-heal:", err);
    } finally {
      // Give the router plugin a beat to regenerate before we re-arm.
      setTimeout(() => {
        healing = false;
      }, 1500);
    }
  };

  const check = async (reason: string) => {
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
      await check("startup scan");
      s.watcher.on("change", (file) => {
        if (file.endsWith("routeTree.gen.ts")) {
          void check("post-write scan");
        }
      });
    },
  };
}
