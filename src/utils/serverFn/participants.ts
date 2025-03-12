import { createClient } from "@/integrations/supabase/server";
import type { TournamentParticipant } from "@/types/tournament.types";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

// TODO: Add more functions and when finished, expand JSDoc

export const participantsQueryOptions = {
  list: (tournamentId: string) =>
    queryOptions({
      queryKey: ["participants", tournamentId],
      queryFn: async () =>
        fetchParticipantsWithProfiles({ data: tournamentId }),
    }),
};

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
