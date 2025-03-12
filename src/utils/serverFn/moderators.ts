// moderators.ts
import { createClient } from "@/integrations/supabase/server";
import type { TournamentModerator } from "@/types/tournament.types";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

// TODO: Add more functions and when finished, expand JSDoc

/**
 * Query options for fetching tournament moderator data.
 */
export const moderatorQueryOptions = {
  /**
   * Query options for fetching moderators for a given tournament ID.
   * @param tournamentId - The ID of the tournament whose moderators to fetch.
   * @returns Query options for fetching the moderators.
   */
  list: (tournamentId: string) =>
    queryOptions({
      queryKey: ["tournament-moderators", tournamentId],
      queryFn: () =>
        fetchModeratorsWithProfiles({
          data: tournamentId,
        }),
    }),
};

/**
 * Fetches tournament moderators, including their profiles, for a given tournament ID.
 * @param tournamentId - The ID of the tournament.
 * @returns An array of TournamentModerator objects, each including profile data. Returns null if no moderators are found, and throws an error if there is a database error.
 */
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
