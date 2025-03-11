import { createClient } from "@/integrations/supabase/server";
import type { Structure, TournamentBracket } from "@/types/tournament.types";
import { createServerFn } from "@tanstack/react-start";

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
