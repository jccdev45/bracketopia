import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { Tournament } from "@/types/tournament.types";
import { fetchTournaments } from "@/utils/tournaments";
import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
} from "@tanstack/react-router";
import { CalendarDays, ChevronRight, Users } from "lucide-react";

export const Route = createFileRoute("/_authed/tournaments")({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw new Error("Not authenticated");
    }
  },
  errorComponent: ({ error }) => {
    if (error.message === "Not authenticated") {
      redirect({ to: "/login" });
    }

    throw error;
  },
  component: RouteComponent,
  loader: () => fetchTournaments(),
});

function RouteComponent() {
  const tournaments = Route.useLoaderData();

  return (
    <SidebarProvider>
      <div className="flex mx-auto container">
        <Sidebar>
          <TournamentSidebar tournaments={tournaments} />
        </Sidebar>
        <main className="flex-1">
          <SidebarTrigger />
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}

function TournamentSidebar({ tournaments }: { tournaments: Tournament[] }) {
  return (
    <>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Tournaments
          </h2>
          <div className="space-y-1">
            {tournaments.map((tournament) => (
              <Link
                key={tournament.id}
                to="/tournaments/$id"
                params={{ id: tournament.id }}
                className={cn(
                  "group flex w-full items-center rounded-md border border-transparent px-4 py-2 hover:bg-muted hover:text-foreground",
                  {
                    "bg-muted": false,
                  },
                )}
              >
                <ChevronRight className="mr-2 h-4 w-4" />
                <span className="line-clamp-1">{tournament.title}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Quick Stats
          </h2>
          <div className="space-y-1">
            <Button className="group flex w-full items-center rounded-md border border-transparent px-4 py-2 hover:bg-muted hover:text-foreground">
              <Users className="mr-2 h-4 w-4" />
              <span className="line-clamp-1">
                {tournaments.length} Tournament{tournaments.length !== 1 && "s"}
              </span>
            </Button>
            <Button className="group flex w-full items-center rounded-md border border-transparent px-4 py-2 hover:bg-muted hover:text-foreground">
              <CalendarDays className="mr-2 h-4 w-4" />
              <span className="line-clamp-1">
                {tournaments.filter((t) => t.registration_open).length} Open
              </span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
