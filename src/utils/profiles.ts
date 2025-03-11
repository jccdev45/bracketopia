import { createClient } from "@/integrations/supabase/server";
import type { User } from "@/types/tournament.types";
import { createServerFn } from "@tanstack/react-start";

export const fetchProfile = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data: userId }): Promise<User | null> => {
    const supabase = createClient();
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error(`There was an error: ${error.message}`);
      throw error;
    }

    return profileData;
  });
