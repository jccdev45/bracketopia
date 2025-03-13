import { createClient } from "@/integrations/supabase/server";
import { createServerFn } from "@tanstack/react-start";

export const fetchProfileFn = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data: id }) => {
    const supabase = createClient();
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("avatar_url,id,username,created_at")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`There was an error: ${error.message}`);
      throw error;
    }

    return profileData;
  });

export const fetchUserTournamentsFn = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data: userId }) => {
    const supabase = createClient();

    // Fetch tournaments created by the user
    const { data: createdTournaments, error: createdError } = await supabase
      .from("tournaments")
      .select("id,title,created_at,max_participants,registration_open")
      .eq("creator_id", userId)
      .order("created_at", { ascending: false });

    if (createdError) throw createdError;

    // Fetch tournaments where user is a participant
    const { data: participations, error: participationsError } = await supabase
      .from("tournament_participants")
      .select("tournament_id, tournaments(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (participationsError) throw participationsError;

    return {
      created: createdTournaments || [],
      participating: participations?.map((p) => p.tournaments) || [],
    };
  });
