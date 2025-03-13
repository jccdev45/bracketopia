import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TournamentBracket } from "@/types/tournament.types";
import { fetchBracket, generateBracket, updateMatchResult } from "@/utils/bracketService";
import { useParams } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BracketView } from "./bracket-view";

interface TournamentBracketsProps {
  brackets: TournamentBracket[];
  participants: { id: string; user_id: string }[];
}

export function TournamentBrackets({ brackets, participants }: TournamentBracketsProps) {
  const { id: tournamentId } = useParams({ from: "/_authed/tournaments/$id" });
  const queryClient = useQueryClient();

  const { data: bracketData } = useQuery({
    queryKey: ["bracket", tournamentId],
    queryFn: () => fetchBracket({ data: { tournamentId } }),
    enabled: brackets.length > 0,
  });

  const generateBracketMutation = useMutation({
    mutationFn: () => generateBracket({ data: { tournamentId, participants } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bracket", tournamentId] });
    },
  });

  const updateMatchMutation = useMutation({
    mutationFn: ({ matchId, winnerId }: { matchId: string; winnerId: string }) =>
      updateMatchResult({
        data: {
          tournamentId,
          matchId,
          score1: 1,
          score2: 0,
          winnerId,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bracket", tournamentId] });
    },
  });

  const handleGenerateBracket = () => {
    generateBracketMutation.mutate();
  };

  const handleUpdateMatch = (matchId: string, winnerId: string) => {
    updateMatchMutation.mutate({ matchId, winnerId });
  };

  if (!bracketData && brackets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="mb-4 text-muted-foreground">No brackets have been generated yet.</p>
        <Button
          onClick={handleGenerateBracket}
          disabled={participants.length < 2 || generateBracketMutation.isPending}
        >
          {generateBracketMutation.isPending ? "Generating..." : "Generate Bracket"}
        </Button>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      {bracketData && (
        <BracketView bracket={bracketData} onUpdateMatch={handleUpdateMatch} />
      )}
    </ScrollArea>
  );
}
