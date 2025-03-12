import { createClient } from "@/integrations/supabase/server";
import type { Profile } from "@/types/profile.types";
import type { Tournament } from "@/types/tournament.types";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

/**
 * Query options for fetching profile data.
 */
export const profileQueryOptions = {
  /**
   * Options for fetching a single profile by user ID.
   * @param userId - The ID of the user whose profile to fetch.
   * @returns Query options for fetching a single profile.
   */
  single: (userId: string) =>
    queryOptions({
      queryKey: ["profile", "single", userId],
      queryFn: () => fetchProfile({ data: userId }),
    }),
  /**
   * Options for fetching tournaments associated with a user.
   * @param userId - The ID of the user whose tournaments to fetch.
   * @returns Query options for fetching tournaments.
   */
  tournaments: (userId: string) =>
    queryOptions({
      queryKey: ["profile", "tournaments", userId],
      queryFn: () => fetchUserTournaments({ data: userId }),
    }),
};

/**
 * Server function to fetch a single profile by ID.
 * @param id - The ID of the profile to fetch.
 * @returns The fetched profile data, or null if not found.  Throws an error if there is a database error.
 */
export const fetchProfile = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data: id }): Promise<Profile | null> => {
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

/**
 * Server function to fetch tournaments created by or involving a user.
 * @param userId - The ID of the user.
 * @returns An object containing arrays of tournaments created by and tournaments participated in by the user.  Throws an error if there is a database error.
 */
export const fetchUserTournaments = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(
    async ({
      data: userId,
    }): Promise<{ created: Tournament[]; participating: Tournament[] }> => {
      const supabase = createClient();

      // Fetch tournaments created by the user
      const { data: createdTournaments, error: createdError } = await supabase
        .from("tournaments")
        .select("*")
        .eq("creator_id", userId)
        .order("created_at", { ascending: false });

      if (createdError) throw createdError;

      // Fetch tournaments where user is a participant
      const { data: participations, error: participationsError } =
        await supabase
          .from("tournament_participants")
          .select("tournament_id, tournaments(*)")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

      if (participationsError) throw participationsError;

      return {
        created: createdTournaments || [],
        participating: participations?.map((p) => p.tournaments) || [],
      };
    },
  );
