import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TournamentModeratorWithProfile } from "@/types/tournament.types";

interface TournamentModeratorsProps {
  moderators: TournamentModeratorWithProfile[];
}

export function TournamentModerators({
  moderators,
}: TournamentModeratorsProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Moderators</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {moderators.map((moderator) => (
            <div key={moderator.id} className="flex items-center space-x-4">
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
        </div>
      </CardContent>
    </Card>
  );
}
