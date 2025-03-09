import { Register } from "@/components/auth/register";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Register />;
}
