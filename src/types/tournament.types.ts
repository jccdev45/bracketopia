// src/types/tournament.types.ts
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/integrations/supabase/generated.types";
import type { Profile } from "@/types/profile.types";

// Base types from Supabase
export type Tournament = Tables<"tournaments">;
export type TournamentParticipant = Tables<"tournament_participants">;
export type TournamentModerator = Tables<"tournament_moderators">;
export type TournamentMatch = Tables<"tournament_matches">;
export type TournamentBracket = Tables<"tournament_brackets">;

// --- Insert types (for creating new records)
export type TournamentInsert = TablesInsert<"tournaments">;
export type TournamentParticipantInsert =
  TablesInsert<"tournament_participants">;
export type TournamentModeratorInsert = TablesInsert<"tournament_moderators">;
export type TournamentBracketInsert = TablesInsert<"tournament_brackets">;
export type TournamentMatchInsert = TablesInsert<"tournament_matches">;

// --- Update types (for modifying existing records)
export type TournamentUpdate = TablesUpdate<"tournaments">;
export type TournamentParticipantUpdate =
  TablesUpdate<"tournament_participants">;
export type TournamentModeratorUpdate = TablesUpdate<"tournament_moderators">;
export type TournamentBracketUpdate = TablesUpdate<"tournament_brackets">;
export type TournamentMatchUpdate = TablesUpdate<"tournament_matches">;

// --- Combined Types (for fetching with relationships) ---

// A participant with their profile data.
export type TournamentParticipantWithProfile = TournamentParticipant & {
  profiles: Profile;
};

// A moderator with their profile data.
export type TournamentModeratorWithProfile = TournamentModerator & {
  profiles: Profile;
};

// A match with participant and winner data (potentially).
export type TournamentMatchWithParticipants = TournamentMatch & {
  participant1: TournamentParticipantWithProfile | null;
  participant2: TournamentParticipantWithProfile | null;
  winner: TournamentParticipantWithProfile | null;
};

// A bracket with its structured data.  We parse the JSON.
export type TournamentBracketWithStructure = Omit<
  TournamentBracket,
  "structure"
> & {
  structure: BracketStructure;
};

// A fully loaded tournament with all related data.
export type TournamentWithDetails = Tournament & {
  creator: Profile; // Use existing Profile
  tournament_participants: TournamentParticipantWithProfile[];
  tournament_brackets: TournamentBracketWithStructure[];
  tournament_moderators: TournamentModeratorWithProfile[];
};

// --- Bracket Structure (this is the JSON shape) ---
// It makes sense to define this *here*, since it's specific to how you store
// the bracket data in Supabase.
export interface BracketStructure {
  rounds: number;
  matches: Array<{
    match_number: number;
    round: number;
    participant1_id: string | null;
    participant2_id: string | null;
    status: MatchStatus;
  }>;
}

// --- Other useful types ---

// Type for match status
export type MatchStatus = "pending" | "completed" | "cancelled";

// Example of a utility type: params for fetching a bracket
export interface FetchBracketParams {
  tournamentId: string;
}
export interface GenerateBracketParams {
  tournamentId: string;
  participants: Array<Pick<TournamentParticipant, "id" | "user_id">>;
}

export interface UpdateMatchResultParams {
  tournamentId: string;
  matchId: string;
  score1: number;
  score2: number;
  winnerId: string;
}

export interface TournamentStats {
  totalTournaments: number;
  totalParticipantSlots: number;
}
