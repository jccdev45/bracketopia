import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTournamentStats } from "@/utils/serverFn/tournaments";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Trophy, Users } from "lucide-react";

export const Route = createFileRoute("/_authed/tournaments/")({
  component: RouteComponent,
  loader: () => fetchTournamentStats(),
});

function RouteComponent() {
  const { user } = Route.useRouteContext();
  const { totalTournaments, totalParticipantSlots } = Route.useLoaderData();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to Bracketopia</h1>
        <p className="text-muted-foreground">
          {user
            ? "Create or join a tournament to get started!"
            : "Sign in to create or join tournaments!"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Tournaments
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTournaments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Participant Slots
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipantSlots}</div>
          </CardContent>
        </Card>
      </div>

      {!user && (
        <div className="mt-8 flex gap-4">
          <Button asChild size="lg">
            <Link to="/register">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
