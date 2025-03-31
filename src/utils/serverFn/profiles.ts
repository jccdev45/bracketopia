import { createClient } from "@/integrations/supabase/server";
import { createServerFn } from "@tanstack/react-start";

/**
 * Custom error class for profile-related errors
 */
class ProfileError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

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
      console.error("❌ Supabase error: ", error);
      throw new ProfileError(
        "Unable to retrieve tournament participants.",
        "TOURNAMENT_PARTICIPANTS_FETCH_FAILED",
      );
    }

    return profileData;
  });

export const searchProfilesFn = createServerFn({ method: "GET" })
  .validator((d: { query: string; excludeIds?: string[] }) => d)
  .handler(async ({ data: { query, excludeIds = [] } }) => {
    const supabase = createClient();
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, username, avatar_url")
      .ilike("username", `%${query}%`)
      .not("id", "in", `(${excludeIds.join(",")})`)
      .limit(5);

    if (error) {
      console.error("❌ Supabase error: ", error);
      throw new ProfileError(
        "Unable to retrieve tournament participants.",
        "TOURNAMENT_PARTICIPANTS_FETCH_FAILED",
      );
    }

    return profiles;
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

    if (createdError) {
      console.error("❌ Supabase error: ", createdError);
      throw new ProfileError(
        "Unable to retrieve tournament participants.",
        "TOURNAMENT_PARTICIPANTS_FETCH_FAILED",
      );
    }

    // Fetch tournaments where user is a participant
    const { data: participations, error: participationsError } = await supabase
      .from("participants")
      .select("tournament_id, tournaments(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (participationsError) {
      console.error("❌ Supabase error: ", participationsError);
      throw new ProfileError(
        "Unable to retrieve tournament participants.",
        "TOURNAMENT_PARTICIPANTS_FETCH_FAILED",
      );
    }

    return {
      created: createdTournaments || [],
      participating: participations?.map((p) => p.tournaments) || [],
    };
  });
