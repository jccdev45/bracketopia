import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ModeratorWithProfile } from "@/types/moderator.types";

interface TournamentModeratorsProps {
  moderators: ModeratorWithProfile[];
}

export function TournamentModerators({
  moderators,
}: TournamentModeratorsProps) {
  return (
    <div className="space-y-4">
      {moderators.map((moderator) => (
        <div
          key={moderator.id}
          className="flex items-center space-x-4 rounded-lg border p-4"
        >
          <Avatar>
            <AvatarImage src={moderator.profiles?.avatar_url || ""} />
            <AvatarFallback>
              {moderator.profiles?.username?.charAt(0) || "M"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{moderator.profiles?.username}</p>
            <p className="text-muted-foreground text-sm">
              @{moderator.profiles?.username}
            </p>
          </div>
        </div>
      ))}
      {!moderators.length && (
        <div className="flex h-24 items-center justify-center rounded-lg border">
          <p className="text-muted-foreground">No moderators found.</p>
        </div>
      )}
    </div>
  );
}
