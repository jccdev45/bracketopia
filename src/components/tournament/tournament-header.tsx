import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TournamentWithDetails } from "@/types/tournament.types";

interface TournamentHeaderProps {
  tournament: TournamentWithDetails;
}

export function TournamentHeader({ tournament }: TournamentHeaderProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{tournament.title}</CardTitle>
        <CardDescription>{tournament.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={tournament.creator?.avatar_url || ""} />
            <AvatarFallback>
              {tournament.creator?.username.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <p className="text-muted-foreground text-sm">
            @{tournament.creator?.username}
          </p>
        </div>
        <div className="mt-4 space-y-2">
          <p>
            <span className="font-semibold">Max Participants:</span>{" "}
            {tournament.max_participants}
          </p>
          <p>
            <span className="font-semibold">Registration Status:</span>{" "}
            {tournament.registration_open ? "Open" : "Closed"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
