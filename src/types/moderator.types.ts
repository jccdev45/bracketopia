import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/integrations/supabase/generated.types";
import type { Profile } from "@/types/profile.types";

export type Moderator = Tables<"moderators">;
export type ModeratorInsert = TablesInsert<"moderators">;
export type ModeratorUpdate = TablesUpdate<"moderators">;

export type ModeratorWithProfile = Moderator & {
  profiles: Profile;
};
