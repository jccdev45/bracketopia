import { DefaultCatchBoundary } from "@/components/shared/default-catch-boundary";
import { Navbar } from "@/components/shared/navbar";
import { NotFound } from "@/components/shared/not-found";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/context/theme-provider";
import TanstackQueryLayout from "@/integrations/tanstack-query/layout";
import appCss from "@/styles/styles.css?url";
import { seo } from "@/utils/config/seo";
import { fetchUserFn } from "@/utils/serverFn/auth";
import type { User } from "@supabase/supabase-js";
import type { QueryClient } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
// NOTE: temp function import
// import { tempUpdateTournamentFn } from "@/utils/serverFn/tournaments";

interface RouterContext {
  queryClient: QueryClient;
  user?: User | null;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Bracketopia",
        description:
          "Create and manage tournament brackets with ease. Organize competitions, approve participants, and track results all in one place.",
      }),
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  beforeLoad: async ({ context }) => {
    await context.queryClient.invalidateQueries({ queryKey: ["user"] });

    const user = await context.queryClient.fetchQuery({
      queryKey: ["user"],
      queryFn: ({ signal }) => fetchUserFn({ signal }),
      staleTime: 0,
    });

    return { user };
  },
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RootDocument>
        <Toaster />
        <Outlet />
        <TanStackRouterDevtools />
        <TanstackQueryLayout />
      </RootDocument>
    </ThemeProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { user } = Route.useRouteContext();

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-svh flex-col">
        <Navbar user={user?.data ?? null} />
        {children}
        <Scripts />
      </body>
    </html>
  );
}
