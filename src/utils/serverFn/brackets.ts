// brackets.ts
import { createClient } from "@/integrations/supabase/server";
import type { Structure, TournamentBracket } from "@/types/tournament.types";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

// TODO: Add more functions and when finished, expand JSDoc

/**
 * Query options for fetching bracket data.
 */
export const bracketQueryOptions = {
  /**
   * Query options for fetching a bracket for a given tournament ID.
   * @param tournamentId - The ID of the tournament whose bracket to fetch.
   * @returns Query options for fetching the bracket.
   */
  list: (tournamentId: string) =>
    queryOptions({
      queryKey: ["brackets", tournamentId],
      queryFn: async () => fetchBracket({ data: tournamentId }),
    }),
};

/**
 * Fetches a single tournament bracket from the database.
 * @param tournamentId - The ID of the tournament.
 * @returns The tournament bracket data, or null if not found. Throws an error if there is a database error.
 */
export const fetchBracket = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(
    async ({ data: tournamentId }): Promise<TournamentBracket | null> => {
      const supabase = createClient();
      const { data: bracket, error } = await supabase
        .from("tournament_brackets")
        .select("*")
        .eq("tournament_id", tournamentId)
        .single()
        .overrideTypes<{
          structure: Structure;
        }>();

      if (error) {
        console.error(`There was an error: ${error.message}`);
        throw error;
      }

      return bracket;
    },
  );
