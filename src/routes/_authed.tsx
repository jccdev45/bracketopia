import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  errorComponent: ({ error }) => {
    if (error.message === "Not authenticated") {
      redirect({ to: "/login" });
    }

    throw error;
  },
});
