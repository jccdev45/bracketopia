import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/my-tournaments")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authed/my-tournaments"!</div>;
}
