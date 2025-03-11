import { Button } from "@/components/ui/button";
import type { BracketData, BracketMatchWithParticipants } from "@/utils/bracketService";

interface BracketViewProps {
  bracket: BracketData;
  onUpdateMatch?: (matchId: string, winnerId: string) => void;
}

export function BracketView({ bracket, onUpdateMatch }: BracketViewProps) {
  const matchesByRound = bracket.matches.reduce<Record<number, BracketMatchWithParticipants[]>>(
    (acc, match) => {
      if (!acc[match.round]) {
        acc[match.round] = [];
      }
      acc[match.round].push(match);
      return acc;
    },
    {},
  );

  return (
    <div className="flex gap-8 overflow-x-auto p-4">
      {Array.from({ length: bracket.structure.rounds }, (_, i) => i + 1).map((round) => (
        <div key={round} className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Round {round}
          </h3>
          <div
            className="flex flex-col gap-4"
            style={{
              marginTop: `${Math.pow(2, round - 1) * 1}rem`,
              marginBottom: `${Math.pow(2, round - 1) * 1}rem`,
            }}
          >
            {matchesByRound[round]?.map((match) => (
              <div
                key={match.id}
                className="relative w-64 rounded-lg border p-4"
                style={{
                  marginTop: `${Math.pow(2, round - 1) * 1}rem`,
                  marginBottom: `${Math.pow(2, round - 1) * 1}rem`,
                }}
              >
                <div className="flex flex-col gap-2">
                  <div
                    className={`flex items-center justify-between ${
                      match.winner?.id === match.participant1?.id
                        ? "text-green-600 dark:text-green-400"
                        : ""
                    }`}
                  >
                    <span className="truncate">
                      {match.participant1?.user.username || "TBD"}
                    </span>
                    <span>{match.score_participant1 ?? "-"}</span>
                    {match.status === "pending" &&
                      match.participant1?.id !== null &&
                      match.participant1?.id !== undefined &&
                      match.participant2?.id !== null &&
                      match.participant2?.id !== undefined && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            onUpdateMatch?.(match.id, match.participant1.id)
                          }
                        >
                          Win
                        </Button>
                      )}
                  </div>
                  <div className="h-px bg-border" />
                  <div
                    className={`flex items-center justify-between ${
                      match.winner?.id === match.participant2?.id
                        ? "text-green-600 dark:text-green-400"
                        : ""
                    }`}
                  >
                    <span className="truncate">
                      {match.participant2?.user.username || "TBD"}
                    </span>
                    <span>{match.score_participant2 ?? "-"}</span>
                    {match.status === "pending" &&
                      match.participant1?.id !== null &&
                      match.participant1?.id !== undefined &&
                      match.participant2?.id !== null &&
                      match.participant2?.id !== undefined && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            onUpdateMatch?.(match.id, match.participant2.id)
                          }
                        >
                          Win
                        </Button>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
