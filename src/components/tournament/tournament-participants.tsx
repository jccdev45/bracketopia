import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TournamentParticipantWithProfile } from "@/types/tournament.types";

interface TournamentParticipantsProps {
  participants?: TournamentParticipantWithProfile[];
}

export function TournamentParticipants({
  participants,
}: TournamentParticipantsProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Participants</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Seed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants?.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell>{participant.status}</TableCell>
                <TableCell>{participant.seed || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
