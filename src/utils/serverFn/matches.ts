import { createClient } from "@/integrations/supabase/server";
import type { UpdateMatchResultParams } from "@/types/match.types";
import { createServerFn } from "@tanstack/react-start";

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
        const { error: updateError } = await supabase
          .from("matches")
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
          .from("matches")
          .select("match_number, round, bracket_id")
          .eq("id", matchId)
          .single();

        if (matchError || !match) {
          throw new Error(
            matchError?.message ?? "Failed to fetch updated match",
          );
        }

        // Calculate the next match number
        const nextMatchNumber = Math.floor((match.match_number - 1) / 2) + 1;

        // Determine which participant slot to update in the next match
        const isFirstMatchInPair = match.match_number % 2 !== 0; // Odd number
        const updatePayload = isFirstMatchInPair
          ? { participant1_id: winnerId }
          : { participant2_id: winnerId };

        // Update the next match with the winner
        const { error: nextMatchError } = await supabase
          .from("matches")
          .update(updatePayload)
          .eq("bracket_id", match.bracket_id)
          .eq("match_number", nextMatchNumber)
          .eq("round", match.round + 1);

        if (nextMatchError) {
          throw new Error(
            `Failed to update next match: ${nextMatchError.message}`,
          );
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
