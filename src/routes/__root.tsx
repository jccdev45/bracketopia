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
import { createClient } from "@/integrations/supabase/server";
import { seo } from "@/utils/seo";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { Menu, UserIcon } from "lucide-react";
import TanstackQueryLayout from "../integrations/tanstack-query/layout";
import TanstackQueryProvider from "../integrations/tanstack-query/provider";
import appCss from "../styles.css?url";

// NOTE: this whole function is direct from https://github.com/TanStack/router/blob/1b402d502fedb84cb073994335b2780169ecc8d7/examples/react/start-supabase-basic/src/routes/__root.tsx#L17
// idk why handler errors, I'm probably fucking something up somewhere
// @ts-expect-error
const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await createClient();
  const { data, error: _error } = await supabase.auth.getUser();

  if (!data.user?.email) {
    return null;
  }

  return data.user;
});

export const Route = createRootRoute({
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
        description: `Create and manage tournament brackets with ease. Organize
            competitions, approve participants, and track results all in one
            place.`,
      }),
    ],
    // TODO: Add icons
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
    const user = await fetchUser();

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
      <TanstackQueryProvider>
        <Toaster />
        <Outlet />
        <TanStackRouterDevtools />
        <TanstackQueryLayout />
      </TanstackQueryProvider>
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
        <nav className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="shrink-0 flex items-center">
                  <Link to="/" className="text-xl font-bold text-gray-900">
                    BracketOpia
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/tournaments"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Tournaments
                  </Link>
                  {user && (
                    <Link
                      to="/tournaments/create"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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
                        <UserIcon className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          to="/profile/$id"
                          params={{
                            id: user.id,
                          }}
                        >
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/my-tournaments">My Tournaments</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/logout">Logout</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="outline" asChild>
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/register">Register</Link>
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/">Home</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/tournaments">Tournaments</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user ? (
                      <>
                        <DropdownMenuItem asChild>
                          <Link
                            to="/profile/$id"
                            params={{
                              id: user.id,
                            }}
                          >
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/my-tournaments">My Tournaments</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/logout">Logout</Link>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/login">Login</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/register">Register</Link>
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
