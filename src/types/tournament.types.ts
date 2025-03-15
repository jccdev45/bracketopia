import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/integrations/supabase/generated.types";
import type { BracketWithStructure } from "@/types/bracket.types";
import type { ModeratorWithProfile } from "@/types/moderator.types";
import type { ParticipantWithProfile } from "@/types/participant.types";
import type { Profile } from "@/types/profile.types";

export type Tournament = Tables<"tournaments">;
export type TournamentInsert = TablesInsert<"tournaments">;
export type TournamentUpdate = TablesUpdate<"tournaments">;

export type TournamentWithDetails = Tournament & {
  participants: ParticipantWithProfile[];
  moderators: ModeratorWithProfile[];
  brackets: BracketWithStructure[];
  creator: Profile;
};
export interface TournamentStats {
  totalParticipantSlots: number;
  totalTournaments: number;
}
