import { createClient } from "@/integrations/supabase/server";
import type { Tournament, User } from "@/types/tournament.types";
import { createServerFn } from "@tanstack/react-start";

export const fetchProfile = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data: id }): Promise<User | null> => {
    const supabase = createClient();
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`There was an error: ${error.message}`);
      throw error;
    }

    return profileData;
  });

export const fetchUserTournaments = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data: userId }): Promise<{ created: Tournament[]; participating: Tournament[] }> => {
    const supabase = createClient();
    
    // Fetch tournaments created by the user
    const { data: createdTournaments, error: createdError } = await supabase
      .from("tournaments")
      .select("*")
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
      participating: participations?.map(p => p.tournaments) || [],
    };
  });
