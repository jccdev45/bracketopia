import { TournamentBrackets } from "@/components/tournament/tournament-brackets";
import { TournamentModerators } from "@/components/tournament/tournament-moderators";
import { TournamentParticipants } from "@/components/tournament/tournament-participants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TournamentWithDetails } from "@/types/tournament.types";
import { fetchTournamentFn } from "@/utils/serverFn/tournaments";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Trophy, Users } from "lucide-react";

export const Route = createFileRoute("/_authed/tournaments/$id")({
  component: RouteComponent,
  loader: async ({ params: { id } }) => {
    const tournament = await fetchTournamentFn({ data: id });
    if ("error" in tournament) {
      throw new Error("Failed to load tournament");
    }
    return tournament as TournamentWithDetails;
  },
});

function RouteComponent() {
  const tournament = Route.useLoaderData();

  return (
    <div className="flex h-full flex-col">
      <div className="border-b">
        <div className="px-6 py-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="font-bold text-2xl">{tournament.title}</h1>
            <Button variant="outline">
              {tournament.registration_open
                ? "Registration Open"
                : "Registration Closed"}
            </Button>
          </div>
          <div className="flex items-center space-x-6 text-muted-foreground text-sm">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <span>{tournament.max_participants} participants maximum</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4" />
              <span>
                Created on{" "}
                {new Date(tournament.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <Trophy className="mr-2 h-4 w-4" />
              <span>Single Elimination</span>
            </div>
          </div>
          {tournament.description && (
            <p className="mt-4 text-muted-foreground text-sm">
              {tournament.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 p-6">
        <Tabs defaultValue="participants" className="flex h-full flex-col">
          <TabsList>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="brackets">Brackets</TabsTrigger>
            <TabsTrigger value="moderators">Moderators</TabsTrigger>
          </TabsList>
          <ScrollArea className="flex-1">
            <TabsContent value="participants" className="mt-4 h-full">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Participants ({tournament.participants?.length || 0}/
                    {tournament.max_participants})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TournamentParticipants
                    participants={tournament.participants}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="brackets" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tournament Brackets</CardTitle>
                </CardHeader>
                <CardContent>
                  <TournamentBrackets
                    tournamentId={tournament.id}
                    // brackets={tournament.brackets}
                    // participants={
                    //   tournament.participants?.map((p) => ({
                    //     id: p.id,
                    //     user_id: p.user_id,
                    //   })) || []
                    // }
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="moderators" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Tournament Moderators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TournamentModerators moderators={tournament.moderators} />
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
}
