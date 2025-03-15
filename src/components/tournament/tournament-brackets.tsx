import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { GenerateBracketParams } from "@/types/bracket.types";
import type { ParticipantWithProfile } from "@/types/participant.types";
import {
  bracketMutationOptions,
  bracketQueryOptions,
} from "@/utils/queries/brackets";
import { participantsQueryOptions } from "@/utils/queries/participants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BracketView } from "./bracket-view";

interface TournamentBracketsProps {
  tournamentId: string;
}

export function TournamentBrackets({ tournamentId }: TournamentBracketsProps) {
  const queryClient = useQueryClient();

  const {
    data: bracketData,
    isLoading: isBracketLoading,
    isError: isBracketError,
    error: bracketError,
  } = useQuery({
    ...bracketQueryOptions.list(tournamentId),
  });

  const {
    data: participants = [] as ParticipantWithProfile[],
    isLoading: isParticipantsLoading,
    isError: isParticipantsError,
    error: participantsError,
  } = useQuery({
    ...participantsQueryOptions.list(tournamentId),
  });

  const generateBracketMutation = useMutation({
    ...bracketMutationOptions.generate(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brackets", tournamentId] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMatchMutation = useMutation({
    ...bracketMutationOptions.updateMatch(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brackets", tournamentId] });
    },
  });

  const handleGenerateBracket = () => {
    const params: GenerateBracketParams = {
      tournamentId,
      participants: participants.map((p) => ({
        id: p.id,
        user_id: p.user_id,
      })),
    };

    generateBracketMutation.mutate({
      data: params,
    });
  };

  const handleUpdateMatch = (matchId: string, winnerId: string) => {
    updateMatchMutation.mutate({
      data: {
        tournamentId,
        matchId,
        score1: 1, //  Example scores.
        score2: 0,
        winnerId,
      },
    });
  };

  if (isBracketLoading || isParticipantsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading tournament data...</p>
      </div>
    );
  }

  if (isBracketError || isParticipantsError) {
    const errorMessage = isBracketError
      ? `Bracket Error: ${(bracketError as Error)?.message}` // Cast to Error
      : `Participant Error: ${
          (participantsError as Error)?.message // Cast to Error
        }`;
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="mb-4 text-muted-foreground">
          Error loading tournament data: {errorMessage}
        </p>
        <Button
          onClick={() => {
            queryClient.refetchQueries({
              queryKey: ["brackets", tournamentId],
            });
            queryClient.refetchQueries({
              queryKey: ["participants", tournamentId],
            });
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!bracketData) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="mb-4 text-muted-foreground">
          No brackets have been generated yet. (Participants:{" "}
          {participants.length})
        </p>
        <Button
          onClick={handleGenerateBracket}
          disabled={
            participants.length < 2 || generateBracketMutation.isPending
          }
        >
          {generateBracketMutation.isPending
            ? "Generating..."
            : "Generate Bracket"}
        </Button>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <BracketView bracket={bracketData} onUpdateMatch={handleUpdateMatch} />
    </ScrollArea>
  );
}
