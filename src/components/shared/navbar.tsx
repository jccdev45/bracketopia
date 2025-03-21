import { ModeToggle } from "@/components/shared/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@supabase/supabase-js";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";

interface NavbarProps {
  user: User | null;
}

export function Navbar({ user }: NavbarProps) {
  return (
    <nav className="border-b bg-white dark:border-sidebar dark:bg-sidebar">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex shrink-0 items-center">
              <Link
                to="/"
                className="font-bold text-primary text-xl dark:text-sidebar-primary-foreground"
              >
                Bracketopia
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link
                to="/tournaments"
                className="inline-flex items-center border-transparent border-b-2 px-1 pt-1 font-medium text-gray-500 text-sm hover:border-gray-300 hover:text-gray-700 dark:border-transparent dark:text-sidebar-foreground hover:dark:border-sidebar-primary hover:dark:text-sidebar-primary"
              >
                Tournaments
              </Link>
              <Link
                to="/tournaments/create"
                className="inline-flex items-center border-transparent border-b-2 px-1 pt-1 font-medium text-gray-500 text-sm hover:border-gray-300 hover:text-gray-700 dark:border-transparent dark:text-sidebar-foreground hover:dark:border-sidebar-primary hover:dark:text-sidebar-primary"
              >
                Create Tournament
              </Link>

              {/* NOTE: temporary button to fire DB update command and fix seeded data */}
              {/* <Button onClick={() => tempUpdateTournamentFn()}>FIX</Button> */}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:gap-2">
            <ModeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar>
                      <AvatarImage
                        src={user.user_metadata.avatar_url as string}
                      />
                      <AvatarFallback>
                        {user.user_metadata.username.charAt(0) as string}
                      </AvatarFallback>
                    </Avatar>
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
  );
}
