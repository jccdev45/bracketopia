import { TournamentBrackets } from "@/components/tournament/tournament-brackets";
import { TournamentModerators } from "@/components/tournament/tournament-moderators";
import { TournamentParticipants } from "@/components/tournament/tournament-participants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { participantsQueryOptions } from "@/utils/queries/participants";
import { tournamentQueryOptions } from "@/utils/queries/tournaments";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  ChartBarStacked,
  Clock,
  Crown,
  ShieldCheck,
  Trophy,
  UserPlus,
  Users,
  Users2,
} from "lucide-react";

export const Route = createFileRoute("/_authed/tournaments/$id")({
  component: RouteComponent,
  loader: async ({ context, params: { id } }) => {
    await context.queryClient.ensureQueryData(
      tournamentQueryOptions.detail(id),
    );
  },
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data: tournament } = useSuspenseQuery(
    tournamentQueryOptions.detail(id),
  );
  const { data: participants = [] } = useQuery({
    ...participantsQueryOptions.list(id),
  });

  const formatName = (format: string) => {
    switch (format) {
      case "single_elimination":
        return "Single Elimination";
      case "double_elimination":
        return "Double Elimination";
      case "round_robin":
        return "Round Robin";
      default:
        return format;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b bg-card">
        <div className="container px-6 py-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="font-bold text-3xl">{tournament.title}</h1>
              {tournament.description && (
                <p className="text-muted-foreground">
                  {tournament.description}
                </p>
              )}
            </div>
            <Button
              variant={tournament.registration_open ? "default" : "secondary"}
            >
              {tournament.registration_open ? (
                <>
                  <UserPlus className="mr-2 size-4" />
                  Join Tournament
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 size-4" />
                  Registration Closed
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Trophy className="size-5 text-primary" />
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm">Format</p>
                    <p className="text-muted-foreground text-sm">
                      {formatName(tournament.format)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Crown className="size-5 text-primary" />
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm">Scoring</p>
                    <p className="text-muted-foreground text-sm">
                      {tournament.scoring_type === "single"
                        ? "Single Match"
                        : `Best of ${tournament.best_of}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Users2 className="size-5 text-primary" />
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm">Participants</p>
                    <p className="text-muted-foreground text-sm">
                      {participants.length}/{tournament.max_participants}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Clock className="size-5 text-primary" />
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm">Schedule</p>
                    <p className="text-muted-foreground text-sm">
                      {tournament.start_date
                        ? format(
                            new Date(tournament.start_date),
                            "MMM d, h:mm a",
                          )
                        : "Not scheduled"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="container flex-1 px-6 py-6">
        <Tabs defaultValue="participants" className="flex h-full flex-col">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="participants" className="flex items-center">
              <Users className="mr-2 size-4" />
              Participants
            </TabsTrigger>
            <TabsTrigger value="brackets" className="flex items-center">
              <ChartBarStacked className="mr-2 size-4" />
              Brackets
            </TabsTrigger>
            <TabsTrigger value="moderators" className="flex items-center">
              <ShieldCheck className="mr-2 size-4" />
              Moderators
            </TabsTrigger>
          </TabsList>
          <ScrollArea className="flex-1">
            <TabsContent value="participants" className="mt-4 h-full">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-lg">
                  {participants.length}/{tournament.max_participants}{" "}
                  Participants
                </h2>
                <Badge
                  variant={
                    tournament.join_type === "open"
                      ? "default"
                      : tournament.join_type === "approval"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {tournament.join_type === "open"
                    ? "Open Registration"
                    : tournament.join_type === "approval"
                      ? "Approval Required"
                      : "Invite Only"}
                </Badge>
              </div>
              <TournamentParticipants
                tournamentId={tournament.id}
                participants={participants}
              />
            </TabsContent>
            <TabsContent value="brackets" className="mt-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-lg">Tournament Brackets</h2>
                <Badge>
                  {tournament.format === "single_elimination"
                    ? "Single Elimination"
                    : tournament.format === "double_elimination"
                      ? "Double Elimination"
                      : "Round Robin"}
                </Badge>
              </div>
              <TournamentBrackets tournamentId={tournament.id} />
            </TabsContent>
            <TabsContent value="moderators" className="mt-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-lg">Tournament Moderators</h2>
                <Badge variant="outline">
                  {tournament.moderators.length} Moderators
                </Badge>
              </div>
              <TournamentModerators moderators={tournament.moderators} />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
}
