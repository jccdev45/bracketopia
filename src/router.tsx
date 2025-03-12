import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { routeTree } from "./routeTree.gen";

import "./styles.css";
import { DefaultCatchBoundary } from "@/components/shared/default-catch-boundary";
import { NotFound } from "@/components/shared/not-found";
import { QueryClient } from "@tanstack/react-query";

// Create a new router instance
export const createRouter = () => {
  const queryClient = new QueryClient();
  const router = createTanstackRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
  });

  return routerWithQueryClient(router, queryClient);
};

const router = createRouter();

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
