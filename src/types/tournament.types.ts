import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/integrations/supabase/generated.types";
import type { BracketWithStructure } from "@/types/bracket.types";
import type { ModeratorWithProfile } from "@/types/moderator.types";
import type { ParticipantWithProfile } from "@/types/participant.types";
import type { Profile } from "@/types/profile.types";

export type TournamentFormat =
  | "single_elimination"
  | "double_elimination"
  | "round_robin";
export type TournamentScoringType = "single" | "best_of";
export type TournamentJoinType = "open" | "approval" | "invite";

export type Tournament = Tables<"tournaments"> & {
  format: TournamentFormat;
  scoring_type: TournamentScoringType;
  join_type: TournamentJoinType;
};

export type TournamentInsert = TablesInsert<"tournaments">;
export type TournamentUpdate = TablesUpdate<"tournaments">;

export type TournamentWithProfile = Tournament & {
  profiles: Partial<Profile>;
};

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
