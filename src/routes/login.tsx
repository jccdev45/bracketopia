import { Login } from "@/components/form/login";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: Login,
});
