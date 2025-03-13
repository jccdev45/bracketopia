import { Login } from "@/components/form/login";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
  component: AuthedComponent,
});

function AuthedComponent() {
  const { user } = Route.useRouteContext();

  if (user) {
    return <Outlet />;
  }

  return <Login />;
}
