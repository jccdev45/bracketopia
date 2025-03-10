import { createClient } from "@/integrations/supabase/server";
import { createServerFn } from "@tanstack/react-start";

export const fetchTournaments = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  },
);

export const fetchTournament = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data: id }) => {
    const supabase = createClient();
    const { data: tournamentData, error: tournamentError } = await supabase
      .from("tournaments")
      .select(
        `
        *,
        tournament_participants (
          id,
          display_name,
          status,
          user_id
        )
      `,
      )
      .eq("id", id)
      .single();

    if (tournamentError) throw tournamentError;

    const { data: creatorData, error: creatorError } = await supabase
      .from("profiles")
      .select("username, full_name")
      .eq("id", tournamentData.creator_id)
      .single();

    if (creatorError) throw creatorError;

    return {
      ...tournamentData,
      creator: creatorError ? null : creatorData,
    };
  });
