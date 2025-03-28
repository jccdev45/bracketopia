import { TournamentList } from "@/components/tournament/list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fetchTournamentStatsFn,
  fetchTournamentsFn,
} from "@/utils/serverFn/tournaments";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Trophy, Users } from "lucide-react";

export const Route = createFileRoute("/_authed/tournaments/")({
  component: TournamentsIndex,
  loader: async () => {
    const [stats, tournaments] = await Promise.all([
      fetchTournamentStatsFn(),
      fetchTournamentsFn(),
    ]);
    return { stats, tournaments };
  },
});

function TournamentsIndex() {
  const { stats, tournaments } = Route.useLoaderData();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Tournaments
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.totalTournaments}</div>
            <p className="text-muted-foreground text-xs">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Slots Available
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {stats.totalParticipantSlots}
            </div>
            <p className="text-muted-foreground text-xs">
              Combined participant capacity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Active Tournaments
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {tournaments.filter((t) => t.registration_open).length}
            </div>
            <p className="text-muted-foreground text-xs">
              Currently open for registration
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tournament List */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-xl">Recent Tournaments</h2>
          <Button variant="outline" asChild>
            <Link to="/tournaments">View All</Link>
          </Button>
        </div>
        <TournamentList tournaments={tournaments.slice(0, 5)} />
      </div>
    </div>
  );
}
