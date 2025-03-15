import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/integrations/supabase/generated.types";
import type { MatchStatus, MatchWithParticipants } from "@/types/match.types";
import type { Participant } from "@/types/participant.types";

export type Bracket = Tables<"brackets">;
export type BracketInsert = TablesInsert<"brackets">;
export type BracketUpdate = TablesUpdate<"brackets">;

export type BracketWithStructure = Omit<Bracket, "structure"> & {
  structure: BracketStructure;
};

export interface BracketStructure {
  matches: Array<{
    participant1_id: string | null;
    participant2_id: string | null;
    match_number: number;
    status: MatchStatus;
    round: number;
  }>;
  rounds: number;
}

export interface FetchBracketParams {
  tournamentId: string;
}

export interface GenerateBracketParams {
  participants: Array<Pick<Participant, "id" | "user_id">>;
  tournamentId: string;
}

// Bracket data with parsed structure and matches
// Renamed to clarify the purpose, and uses the shared types.
export interface BracketViewData {
  structure: BracketStructure;
  matches: MatchWithParticipants[];
}

// Props for the BracketView component.
export interface BracketViewProps {
  bracket: BracketViewData;
  onUpdateMatch?: (matchId: string, winnerId: string) => void;
}
