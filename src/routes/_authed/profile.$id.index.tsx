import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  fetchProfileFn,
  fetchUserTournamentsFn,
} from "@/utils/serverFn/profiles";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Trophy, Users } from "lucide-react";

export const Route = createFileRoute("/_authed/profile/$id/")({
  component: RouteComponent,
  loader: async ({ params: { id } }) => {
    const [profile, tournaments] = await Promise.all([
      fetchProfileFn({ data: id }),
      fetchUserTournamentsFn({ data: id }),
    ]);
    return { profile, tournaments };
  },
});

function RouteComponent() {
  const { profile, tournaments } = Route.useLoaderData();
  const { user } = Route.useRouteContext();

  if (!profile) return null;

  const isOwnProfile = user?.id === profile.id;

  return (
    <div className="container mx-auto space-y-8 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback>
              {profile.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="mb-2 text-2xl">{profile.username}</CardTitle>
            <div className="text-muted-foreground text-sm">
              Member since {new Date(profile.created_at).toLocaleDateString()}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="created" className="space-y-4">
        <TabsList>
          <TabsTrigger value="created">Created Tournaments</TabsTrigger>
          <TabsTrigger value="participating">Participating In</TabsTrigger>
        </TabsList>

        <TabsContent value="created" className="space-y-4">
          {tournaments.created.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tournaments.created.map((tournament) => (
                <Link
                  key={tournament.id}
                  to="/tournaments/$id"
                  params={{ id: tournament.id }}
                >
                  <Card className="transition-colors hover:bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <CardTitle className="line-clamp-1">
                          {tournament.title}
                        </CardTitle>
                        <div className="space-y-1 text-muted-foreground text-sm">
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            <span>
                              {tournament.max_participants} participants
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Trophy className="mr-2 h-4 w-4" />
                            <span>
                              {tournament.registration_open ? "Open" : "Closed"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            <span>
                              {new Date(
                                tournament.created_at,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No tournaments created yet
                {isOwnProfile && (
                  <div className="mt-4">
                    <Button asChild>
                      <Link to="/tournaments/create">Create Tournament</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="participating" className="space-y-4">
          {tournaments.participating.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tournaments.participating.map((tournament) => (
                <Link
                  key={tournament.id}
                  to="/tournaments/$id"
                  params={{ id: tournament.id }}
                >
                  <Card className={cn("transition-colors hover:bg-muted/50")}>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <CardTitle className="line-clamp-1">
                          {tournament.title}
                        </CardTitle>
                        <div className="space-y-1 text-muted-foreground text-sm">
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            <span>
                              {tournament.max_participants} participants
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Trophy className="mr-2 h-4 w-4" />
                            <span>
                              {tournament.registration_open ? "Open" : "Closed"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            <span>
                              {new Date(
                                tournament.created_at,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Not participating in any tournaments
                {isOwnProfile && (
                  <div className="mt-4">
                    <Button asChild variant="outline">
                      <Link to="/tournaments">Browse Tournaments</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
