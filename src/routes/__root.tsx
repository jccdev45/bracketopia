import { DefaultCatchBoundary } from "@/components/shared/default-catch-boundary";
import { NotFound } from "@/components/shared/not-found";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import TanstackQueryLayout from "@/integrations/tanstack-query/layout";
import appCss from "@/styles/styles.css?url";
import { seo } from "@/utils/config/seo";
import { fetchUserFn } from "@/utils/serverFn/auth";
import type { User } from "@supabase/supabase-js";
import type { QueryClient } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Menu, UserIcon } from "lucide-react";

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
  beforeLoad: async () => {
    const user = await fetchUserFn();

    return {
      user,
    };
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
    <RootDocument>
      <Toaster />
      <Outlet />
      <TanStackRouterDevtools />
      <TanstackQueryLayout />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { user } = Route.useRouteContext();

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <nav className="border-b bg-white dark:border-sidebar dark:bg-sidebar">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex shrink-0 items-center">
                  <Link
                    to="/"
                    className="font-bold text-primary-foreground text-xl dark:text-sidebar-primary-foreground"
                  >
                    BracketOpia
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/tournaments"
                    className="inline-flex items-center border-transparent border-b-2 px-1 pt-1 font-medium text-gray-500 text-sm hover:border-gray-300 hover:text-gray-700 dark:border-transparent dark:text-sidebar-foreground hover:dark:border-sidebar-primary hover:dark:text-sidebar-primary"
                  >
                    Tournaments
                  </Link>
                  {user && (
                    <Link
                      to="/tournaments/create"
                      className="inline-flex items-center border-transparent border-b-2 px-1 pt-1 font-medium text-gray-500 text-sm hover:border-gray-300 hover:text-gray-700 dark:border-transparent dark:text-sidebar-foreground hover:dark:border-sidebar-primary hover:dark:text-sidebar-primary"
                    >
                      Create Tournament
                    </Link>
                  )}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <UserIcon className="h-5 w-5 text-gray-500 dark:text-sidebar-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel className="text-gray-900 dark:text-sidebar-primary">
                        My Account
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          to="/profile/$id"
                          params={{ id: user.id }}
                          className="text-gray-900 hover:text-gray-700 dark:text-sidebar-primary dark:hover:text-sidebar-primary"
                        >
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          to="/logout"
                          className="text-gray-900 hover:text-gray-700 dark:text-sidebar-primary dark:hover:text-sidebar-primary"
                        >
                          Logout
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="outline" asChild>
                      <Link
                        to="/login"
                        className="text-gray-900 hover:text-gray-700 dark:text-sidebar-primary dark:hover:text-sidebar-primary"
                      >
                        Login
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link
                        to="/register"
                        className="text-gray-900 hover:text-gray-700 dark:text-sidebar-primary dark:hover:text-sidebar-primary"
                      >
                        Register
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
              {/* Mobile Menu -  Add hover styles here too for consistency */}
              <div className="flex items-center sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5 text-gray-500 dark:text-sidebar-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        to="/"
                        className="hover:text-gray-700 dark:hover:text-sidebar-primary"
                      >
                        Home
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/tournaments"
                        className="hover:text-gray-700 dark:hover:text-sidebar-primary"
                      >
                        Tournaments
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user ? (
                      <>
                        <DropdownMenuItem asChild>
                          <Link
                            to="/profile/$id"
                            params={{ id: user.id }}
                            className="hover:text-gray-700 dark:hover:text-sidebar-primary"
                          >
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            to="/logout"
                            className="hover:text-gray-700 dark:hover:text-sidebar-primary"
                          >
                            Logout
                          </Link>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link
                            to="/login"
                            className="hover:text-gray-700 dark:hover:text-sidebar-primary"
                          >
                            Login
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            to="/register"
                            className="hover:text-gray-700 dark:hover:text-sidebar-primary"
                          >
                            Register
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </nav>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
