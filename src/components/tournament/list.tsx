import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types/profile.types";
import type { Tournament } from "@/types/tournament.types";
import type { User } from "@supabase/supabase-js";
import { Link } from "@tanstack/react-router";
import { CalendarDays, UserIcon, Users } from "lucide-react";

interface TournamentListProps {
  tournaments: Array<
    Pick<
      Tournament,
      | "id"
      | "title"
      | "registration_open"
      | "description"
      | "created_at"
      | "max_participants"
    > & {
      profiles: Pick<Profile, "username">;
    }
  >;
  user: User | null;
}

export function TournamentList({ tournaments }: TournamentListProps) {
  if (tournaments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No tournaments found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tournaments.map((tournament) => (
        <div
          key={tournament.id}
          className="flex flex-col items-start justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50 sm:flex-row sm:items-center"
        >
          <div className="w-full space-y-1 sm:w-auto">
            <Link
              to="/tournaments/$id"
              params={{ id: tournament.id }}
              className="line-clamp-1 font-medium hover:underline"
            >
              {tournament.title}
            </Link>
            <p className="line-clamp-2 text-muted-foreground text-sm sm:line-clamp-1">
              {tournament.description || "No description"}
            </p>
            <div className="flex flex-wrap gap-4 pt-1">
              <div className="flex items-center text-muted-foreground text-sm">
                <UserIcon className="mr-1 h-3 w-3 flex-shrink-0" />
                <span className="max-w-[120px] truncate">
                  {tournament.profiles.username || "N/A"}
                </span>
              </div>
              <div className="flex items-center text-muted-foreground text-sm">
                <Users className="mr-1 h-3 w-3 flex-shrink-0" />
                <span>{tournament.max_participants} slots</span>
              </div>
              <div className="flex items-center text-muted-foreground text-sm">
                <CalendarDays className="mr-1 h-3 w-3 flex-shrink-0" />
                <span>
                  {new Date(tournament.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
            {tournament.registration_open ? (
              <Badge variant="success">Open</Badge>
            ) : (
              <Badge variant="destructive">Closed</Badge>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link to="/tournaments/$id" params={{ id: tournament.id }}>
                View
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
