import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { Profile } from "@/types/profile.types";
import { tournamentQueryOptions } from "@/utils/queries/tournaments";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
} from "@tanstack/react-router";
import { CalendarDays, User, Users } from "lucide-react";

export const Route = createFileRoute("/_authed/tournaments")({
  errorComponent: ({ error }) => {
    if (error.message === "Not authenticated") {
      redirect({ to: "/login" });
    }

    throw error;
  },
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(tournamentQueryOptions.list());
  },
});

function RouteComponent() {
  const { data: tournaments } = useSuspenseQuery(tournamentQueryOptions.list());

  return (
    <SidebarProvider>
      <div className="container mx-auto flex">
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

interface SidebarTournamentItem {
  id: string;
  title: string;
  description?: string | null;
  creator?: Profile;
  max_participants: number;
  registration_open: boolean;
}

function TournamentSidebar({
  tournaments,
}: {
  tournaments: SidebarTournamentItem[];
}) {
  return (
    <>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 font-semibold text-lg tracking-tight">
            Tournaments
          </h2>
          <Accordion type="multiple">
            {tournaments.map((tournament) => (
              <AccordionItem key={tournament.id} value={tournament.id}>
                <AccordionTrigger>
                  <span className="line-clamp-1 font-semibold">
                    {tournament.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 divide-y-2">
                    <p className="grid">
                      <Label htmlFor="description" className="font-medium">
                        Description:
                      </Label>{" "}
                      <span id="description" className="">
                        {tournament.description || "No description provided"}
                      </span>
                    </p>
                    <p className="grid">
                      <Label htmlFor="username" className="font-medium">
                        Creator:
                      </Label>{" "}
                      <span id="username" className="">
                        {tournament.creator?.username || "Unknown"}
                      </span>
                    </p>
                    <p className="grid">
                      <Label htmlFor="max_participants" className="font-medium">
                        Max Participants:
                      </Label>{" "}
                      <span id="max_participants" className="">
                        {tournament.max_participants}
                      </span>
                    </p>
                    <p className="grid">
                      <Label
                        htmlFor="registration_open"
                        className="font-medium"
                      >
                        Registration Open:
                      </Label>{" "}
                      <span id="registration_open" className="">
                        {tournament.registration_open ? "Yes" : "No"}
                      </span>
                    </p>
                    <Button asChild variant="link">
                      <Link
                        to={"/tournaments/$id"}
                        params={{
                          id: tournament.id,
                        }}
                        className="w-full rounded-md border border-transparent bg-muted/70 px-4 py-2 transition-all duration-150 ease-in-out hover:bg-muted hover:text-foreground hover:tracking-wide"
                      >
                        Details
                      </Link>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 font-semibold text-lg tracking-tight">
            Quick Stats
          </h2>
          <div className="space-y-1">
            <Alert>
              <Users className="mr-2 h-4 w-4" />
              <span className="line-clamp-1">
                {tournaments.length}{" "}
                {tournaments.length === 1 ? "Tournament" : "Tournaments"}
              </span>
            </Alert>
            <Alert>
              <CalendarDays className="mr-2 h-4 w-4" />
              <span className="line-clamp-1">
                {tournaments.filter((t) => t.registration_open).length} Open{" "}
                {tournaments.filter((t) => t.registration_open).length === 1
                  ? "Tournament"
                  : "Tournaments"}
              </span>
            </Alert>
            <Alert>
              <User className="mr-2 h-4 w-4" />
              <span className="line-clamp-1">
                {tournaments.reduce((sum, t) => sum + t.max_participants, 0)}{" "}
                Total Slots
              </span>
            </Alert>
          </div>
        </div>
      </div>
    </>
  );
}
