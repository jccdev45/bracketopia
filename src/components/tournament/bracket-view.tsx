import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type {
  BracketStructure,
  TournamentMatchWithParticipants,
  TournamentParticipantWithProfile,
} from "@/types/tournament.types";

interface BracketViewProps {
  bracket: {
    structure: BracketStructure;
    matches: TournamentMatchWithParticipants[];
  };
  onUpdateMatch?: (matchId: string, winnerId: string) => void;
}

const isValidParticipant = (
  participant: TournamentParticipantWithProfile | null,
): participant is TournamentParticipantWithProfile => {
  return participant !== null && typeof participant.id === "string";
};

const isValidMatchForUpdate = (
  match: TournamentMatchWithParticipants,
): match is TournamentMatchWithParticipants & {
  participant1: TournamentParticipantWithProfile;
  participant2: TournamentParticipantWithProfile;
} => {
  return (
    match.status === "pending" &&
    isValidParticipant(match.participant1) &&
    isValidParticipant(match.participant2)
  );
};

export function BracketView({ bracket, onUpdateMatch }: BracketViewProps) {
  // Use bracket.matches to group by round
  const matchesByRound = bracket.matches.reduce<
    Record<number, TournamentMatchWithParticipants[]>
  >((acc, match) => {
    if (!acc[match.round]) {
      acc[match.round] = [];
    }
    acc[match.round].push(match);
    return acc;
  }, {});

  return (
    <div className="flex gap-12 overflow-x-auto p-6">
      {/* Use bracket.structure.rounds to determine the number of rounds */}
      {Array.from({ length: bracket.structure.rounds }, (_, i) => i + 1).map(
        (round) => (
          <div key={round} className="flex flex-col gap-8">
            <h3 className="font-semibold text-lg text-muted-foreground">
              Round {round}
            </h3>
            <div
              className="flex flex-col gap-8"
              style={{
                marginTop: round > 1 ? `${2 ** (round - 2) * 2}rem` : "0",
              }}
            >
              {/*Use the matches grouped by round */}
              {(matchesByRound[round] || []).map((match) => {
                console.log("🚀 ~ { ~ match:", match);
                return (
                  <Card
                    key={match.id}
                    className={`relative w-72 p-4 shadow-md transition-all hover:shadow-lg ${
                      match.status === "completed" ? "bg-muted/10" : ""
                    }`}
                  >
                    <div className="flex flex-col gap-3">
                      <div
                        className={`flex items-center justify-between rounded-sm p-2 ${
                          match.winner?.id === match.participant1?.id
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : match.status === "completed"
                              ? "text-muted-foreground"
                              : "hover:bg-muted/50"
                        }`}
                      >
                        <span className="truncate font-medium">
                          {match.participant1?.profiles?.username ?? "TBD"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="tabular-nums">
                            {match.score_participant1 ?? "-"}
                          </span>
                          {isValidMatchForUpdate(match) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2"
                              onClick={() =>
                                onUpdateMatch?.(match.id, match.participant1.id)
                              }
                            >
                              Win
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="h-px bg-border" />
                      <div
                        className={`flex items-center justify-between rounded-sm p-2 ${
                          match.winner?.id === match.participant2?.id
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : match.status === "completed"
                              ? "text-muted-foreground"
                              : "hover:bg-muted/50"
                        }`}
                      >
                        <span className="truncate font-medium">
                          {match.participant2?.profiles?.username ?? "TBD"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="tabular-nums">
                            {match.score_participant2 ?? "-"}
                          </span>
                          {isValidMatchForUpdate(match) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2"
                              onClick={() =>
                                onUpdateMatch?.(match.id, match.participant2.id)
                              } // No '!' needed
                            >
                              Win
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ),
      )}
    </div>
  );
}
