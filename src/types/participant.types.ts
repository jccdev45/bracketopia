import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/integrations/supabase/generated.types";
import type { Profile } from "@/types/profile.types";

export type Participant = Tables<"participants">;
export type ParticipantInsert = TablesInsert<"participants">;
export type ParticipantUpdate = TablesUpdate<"participants">;

export type ParticipantWithProfile = Participant & {
  profiles: Profile;
};
