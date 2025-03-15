// src/types/tournament.types.ts
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/integrations/supabase/generated.types";
import type { Profile } from "@/types/profile.types";

// Base types from Supabase
export type Tournament = Tables<"tournaments">;
export type Participant = Tables<"participants">;
export type Moderator = Tables<"moderators">;
export type Match = Tables<"matches">;
export type Bracket = Tables<"brackets">;

// --- Insert types (for creating new records)
export type TournamentInsert = TablesInsert<"tournaments">;
export type ParticipantInsert = TablesInsert<"participants">;
export type ModeratorInsert = TablesInsert<"moderators">;
export type BracketInsert = TablesInsert<"brackets">;
export type MatchInsert = TablesInsert<"matches">;

// --- Update types (for modifying existing records)
export type TournamentUpdate = TablesUpdate<"tournaments">;
export type ParticipantUpdate = TablesUpdate<"participants">;
export type ModeratorUpdate = TablesUpdate<"moderators">;
export type BracketUpdate = TablesUpdate<"brackets">;
export type MatchUpdate = TablesUpdate<"matches">;

// --- Combined Types (for fetching with relationships) ---

// A participant with their profile data.
export type ParticipantWithProfile = Participant & {
  profiles: Profile;
};

// A moderator with their profile data.
export type ModeratorWithProfile = Moderator & {
  profiles: Profile;
};

// A match with participant and winner data (potentially).
export type MatchWithParticipants = Match & {
  participant1: ParticipantWithProfile | null;
  participant2: ParticipantWithProfile | null;
  winner: ParticipantWithProfile | null;
};

// A bracket with its structured data.  We parse the JSON.
export type BracketWithStructure = Omit<Bracket, "structure"> & {
  structure: BracketStructure;
};

// A fully loaded tournament with all related data.
export type TournamentWithDetails = Tournament & {
  creator: Profile; // Use existing Profile
  participants: ParticipantWithProfile[];
  brackets: BracketWithStructure[];
  moderators: ModeratorWithProfile[];
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
  participants: Array<Pick<Participant, "id" | "user_id">>;
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
