import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchTournaments } from "@/utils/tournaments";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Users } from "lucide-react";

export const Route = createFileRoute("/_authed/tournaments")({
  component: RouteComponent,
  loader: () => fetchTournaments(),
});

function RouteComponent() {
  const { user } = Route.useRouteContext();
  const tournaments = Route.useLoaderData();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">All Tournaments</h1>

      {tournaments && tournaments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <Card key={tournament.id} className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-2">
                  {tournament.title}
                </CardTitle>
                <CardDescription>
                  {tournament.description ? (
                    <p className="line-clamp-2">{tournament.description}</p>
                  ) : (
                    <p className="text-gray-500 italic">
                      No description provided
                    </p>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="grow">
                <div className="flex flex-col space-y-2 text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      {tournament.max_participants} participants maximum
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      Created on{" "}
                      {new Date(tournament.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t">
                <Button asChild className="w-full">
                  <Link
                    to="/tournaments/$id"
                    params={{
                      id: tournament.id,
                    }}
                  >
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No tournaments found
          </h3>
          <p className="text-gray-500 mb-4">
            Be the first to create a tournament!
          </p>
          {user && (
            <Button asChild>
              <Link to="/tournaments/create">Create Tournament</Link>
            </Button>
          )}
          {!user && (
            <div className="flex flex-col items-center space-y-4">
              <p className="text-gray-600">Sign in to create a tournament</p>
              <div className="flex space-x-4">
                <Button asChild variant="outline">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      <Separator />
      <Outlet />
    </div>
  );
}
