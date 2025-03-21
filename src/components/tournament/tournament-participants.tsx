import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ParticipantWithProfile } from "@/types/participant.types";

interface TournamentParticipantsProps {
  participants?: ParticipantWithProfile[];
}

export function TournamentParticipants({
  participants,
}: TournamentParticipantsProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        {/* Insert form component Combobox for participant selection */}
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
                <TableCell>{participant.profiles.username}</TableCell>
                <TableCell>
                  <Badge>{participant.status}</Badge>
                </TableCell>
                <TableCell>{participant.seed || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
