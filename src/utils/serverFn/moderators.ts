import { createClient } from "@/integrations/supabase/server";
import { createServerFn } from "@tanstack/react-start";

/**
 * Custom error class for moderator-related errors
 */
class ModeratorError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

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
      .from("moderators")
      .select(`
          id,
          user_id,
          tournament_id,
          created_at,
          profiles (
            id,
            username,
            avatar_url
          )
        `)
      .eq("tournament_id", tournamentId);

    if (error) {
      console.error("❌ Supabase error: ", error);
      throw new ModeratorError(
        "Unable to retrieve tournament moderators.",
        "TOURNAMENT_MODERATORS_FETCH_FAILED",
      );
    }

    return moderatorsWithProfiles;
  });
