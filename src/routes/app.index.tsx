import { createFileRoute } from "@tanstack/react-router";
import { usePersona } from "@/store/persona";
import { SafaricomHome } from "@/screens/home/SafaricomHome";
import { ExplorerHome } from "@/screens/home/ExplorerHome";
import { RoamingHome } from "@/screens/home/RoamingHome";
import { DiasporaHome } from "@/screens/home/DiasporaHome";
import { TransitionHome } from "@/screens/home/TransitionHome";

export const Route = createFileRoute("/app/")({
  component: HomeDispatcher,
});

function HomeDispatcher() {
  const persona = usePersona((s) => s.persona);
  switch (persona) {
    case "safaricom":
      return <SafaricomHome />;
    case "explorer":
      return <ExplorerHome />;
    case "roaming":
      return <RoamingHome />;
    case "diaspora":
      return <DiasporaHome />;
    case "transition":
      return <TransitionHome />;
    default:
      return <SafaricomHome />;
  }
}
