import { createClient } from "@/integrations/supabase/server";
import { createServerFn } from "@tanstack/react-start";

// TODO: Add more functions and when finished, expand JSDoc

export const fetchParticipantsWithProfilesFn = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data: tournamentId }) => {
    const supabase = createClient();
    const { data: participantsWithProfile, error } = await supabase
      .from("tournament_participants")
      .select(`
          created_at,
          id,
          seed,
          status,
          tournament_id,
          updated_at,
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

    return participantsWithProfile;
  });
