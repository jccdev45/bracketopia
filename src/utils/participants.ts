import { createClient } from "@/integrations/supabase/server";
import type { TournamentParticipant } from "@/types/tournament.types";
import { createServerFn } from "@tanstack/react-start";

export const fetchParticipantsWithProfiles = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(
    async ({ data: tournamentId }): Promise<TournamentParticipant[] | null> => {
      const supabase = createClient();
      const { data: participantsWithProfile, error } = await supabase
        .from("tournament_participants")
        .select(`
          id,
          tournament_id,
          user_id,
          status,
          created_at,
          updated_at,
          seed,
          profiles (
            *
          )
        `)
        .eq("tournament_id", tournamentId);

      if (error) {
        console.error(`There was an error: ${error.message}`);
        throw error;
      }

      return participantsWithProfile;
    },
  );
