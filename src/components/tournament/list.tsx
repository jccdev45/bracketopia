import { Button } from "@/components/ui/button";
import type { Tournament } from "@/types/tournament.types";
import { Link } from "@tanstack/react-router";
import { CalendarDays, User, Users } from "lucide-react";

interface TournamentListProps {
  tournaments: Tournament[];
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
          className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50"
        >
          <div className="space-y-1">
            <Link
              to="/tournaments/$id"
              params={{ id: tournament.id }}
              className="font-medium hover:underline"
            >
              {tournament.title}
            </Link>
            <p className="line-clamp-1 text-muted-foreground text-sm">
              {tournament.description || "No description"}
            </p>
            <div className="flex gap-4 pt-1">
              <div className="flex items-center text-muted-foreground text-sm">
                <User className="mr-1 h-3 w-3" />
                <span>{tournament.creator_id}</span>
              </div>
              <div className="flex items-center text-muted-foreground text-sm">
                <Users className="mr-1 h-3 w-3" />
                <span>{tournament.max_participants} slots</span>
              </div>
              <div className="flex items-center text-muted-foreground text-sm">
                <CalendarDays className="mr-1 h-3 w-3" />
                <span>
                  {new Date(tournament.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-1 text-xs ${
                tournament.registration_open
                  ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400"
              }`}
            >
              {tournament.registration_open ? "Open" : "Closed"}
            </span>
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
