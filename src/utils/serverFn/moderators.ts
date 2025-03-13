import { createClient } from "@/integrations/supabase/server";
import { createServerFn } from "@tanstack/react-start";

// TODO: Add more functions and when finished, expand JSDoc

/**
 * Fetches tournament moderators, including their profiles, for a given tournament ID.
 * @param tournamentId - The ID of the tournament.
 * @returns An array of TournamentModerator objects, each including profile data. Returns null if no moderators are found, and throws an error if there is a database error.
 */
export const fetchModeratorsWithProfilesFn = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data: tournamentId }) => {
    const supabase = createClient();
    const { data: moderatorsWithProfiles, error } = await supabase
      .from("tournament_moderators")
      .select(`
          id,
          user_id,
          profiles (
            id,
            username,
            avatar_url
          )
        `)
      .eq("tournament_id", tournamentId);

    if (error) {
      console.error(`There was an error: ${error.message}`);
      throw error;
    }

    return moderatorsWithProfiles;
  });
