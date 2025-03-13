import { createClient } from "@/integrations/supabase/server";
import type { Structure } from "@/types/tournament.types";
import { createServerFn } from "@tanstack/react-start";

// TODO: Add more functions and when finished, expand JSDoc

export const fetchBracketFn = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data: tournamentId }) => {
    const supabase = createClient();
    const { data: bracket, error } = await supabase
      .from("tournament_brackets")
      .select("id,structure,current_round,created_at,updated_at")
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
  });
