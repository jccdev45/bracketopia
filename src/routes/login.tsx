import { Login } from "@/components/form/login";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  // beforeLoad: ({ context }) => {
  //   if (context.user) {
  //     throw redirect({ to: "/tournaments"})
  //   }
  // },
  // validateSearch: (search: Record<string, unknown>): LoginSearch => {
  //   return {
  //     redirect: (search.redirect as string) || "/",
  //   };
  // },
  component: LoginComponent,
});

function LoginComponent() {
  return <Login />;
}
