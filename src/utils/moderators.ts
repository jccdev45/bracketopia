import { createClient } from "@/integrations/supabase/server";
import type { TournamentModerator } from "@/types/tournament.types";
import { createServerFn } from "@tanstack/react-start";

export const fetchModeratorsWithProfiles = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(
    async ({ data: tournamentId }): Promise<TournamentModerator[] | null> => {
      const supabase = createClient();
      const { data: moderatorsWithProfiles, error } = await supabase
        .from("tournament_moderators")
        .select(`
          *,
          profiles (
            *
          )
        `)
        .eq("tournament_id", tournamentId);

      if (error) {
        console.error(`There was an error: ${error.message}`);
        throw error;
      }

      return moderatorsWithProfiles;
    },
  );
