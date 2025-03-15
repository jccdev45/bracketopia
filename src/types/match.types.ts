import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/integrations/supabase/generated.types";
import type { ParticipantWithProfile } from "@/types/participant.types";

export type Match = Tables<"matches">;
export type MatchInsert = TablesInsert<"matches">;
export type MatchUpdate = TablesUpdate<"matches">;

export type MatchWithParticipants = Match & {
  participant1: ParticipantWithProfile | null;
  participant2: ParticipantWithProfile | null;
  winner: ParticipantWithProfile | null;
};

export type MatchStatus = "pending" | "completed" | "cancelled";

export interface UpdateMatchResultParams {
  tournamentId: string;
  winnerId: string;
  matchId: string;
  score1: number;
  score2: number;
}
