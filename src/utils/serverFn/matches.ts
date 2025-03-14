import { createClient } from "@/integrations/supabase/server";
import type { UpdateMatchResultParams } from "@/types/bracket.types";
import { createServerFn } from "@tanstack/react-start";

/**
 * Updates a match result and advances the winner
 */
export const updateMatchResultFn = createServerFn({ method: "POST" })
  .validator((d: UpdateMatchResultParams) => d)
  .handler(
    async ({
      data: { tournamentId, matchId, score1, score2, winnerId },
    }: {
      data: UpdateMatchResultParams;
    }) => {
      const supabase = createClient();

      try {
        // Update the match result
        const { error: updateError } = await supabase
          .from("tournament_matches")
          .update({
            score_participant1: score1,
            score_participant2: score2,
            winner_id: winnerId,
            status: "completed",
          })
          .eq("id", matchId)
          .eq("tournament_id", tournamentId);

        if (updateError) {
          throw new Error(`Failed to update match: ${updateError.message}`);
        }

        // Get the updated match to find the next match
        const { data: match, error: matchError } = await supabase
          .from("tournament_matches")
          .select("match_number, round, bracket_id")
          .eq("id", matchId)
          .single();

        if (matchError || !match) {
          throw new Error(
            matchError?.message ?? "Failed to fetch updated match",
          );
        }

        // Find the next match
        const nextMatchNumber = Math.floor((match.match_number - 1) / 2) + 1;
        const isFirstMatch = match.match_number % 2 === 1;

        // Update the next match with the winner
        const { error: nextMatchError } = await supabase
          .from("tournament_matches")
          .update(
            isFirstMatch
              ? { participant1_id: winnerId }
              : { participant2_id: winnerId },
          )
          .eq("bracket_id", match.bracket_id)
          .eq("match_number", nextMatchNumber)
          .eq("round", match.round + 1);

        if (nextMatchError) {
          throw new Error(`Failed to update next match: ${nextMatchError.message}`);
        }

        return { success: true };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to update match result: ${error.message}`);
        }
        throw error;
      }
    },
  );
