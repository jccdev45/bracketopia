import type {
  Json,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/integrations/supabase/generated.types";
import type { Profile } from "@/types/profile.types";

// Explicit enum for match status
export type MatchStatus = "pending" | "completed" | "cancelled";

// Type for tournament participants
export type TournamentParticipant = Tables<"tournament_participants"> & {
  profiles?: Profile | null;
};

// Type for tournament moderators
export type TournamentModerator = Tables<"tournament_moderators"> & {
  profiles?: Profile | null;
};

// Type for tournament matches
export type TournamentMatch = Tables<"tournament_matches"> & {
  participant1?: Pick<TournamentParticipant, "id"> | null;
  participant2?: Pick<TournamentParticipant, "id"> | null;
  winner?: Pick<TournamentParticipant, "id"> | null;
};

// Type for tournament brackets
export type TournamentBracket = Omit<
  Tables<"tournament_brackets">,
  "structure"
> & {
  structure: Structure;
};

// Type for tournament structure
export interface Structure {
  rounds: number;
  matches: TournamentMatch[];
}

// Type for tournaments
export type Tournament = Tables<"tournaments">;

export type FullTournament = Tables<"tournaments"> & {
  creator: Profile | null;
  tournament_participants: TournamentParticipant[];
  tournament_brackets: TournamentBracket[];
  tournament_moderators: TournamentModerator[];
};

export interface TournamentStats {
  totalTournaments: number;
  totalParticipantSlots: number;
}

// Insert types
export type TournamentInsert = TablesInsert<"tournaments">;
export type TournamentParticipantInsert =
  TablesInsert<"tournament_participants">;
export type TournamentModeratorInsert = TablesInsert<"tournament_moderators">;
export type TournamentBracketInsert = TablesInsert<"tournament_brackets">;
export type TournamentMatchInsert = TablesInsert<"tournament_matches">;

// Update types
export type TournamentUpdate = TablesUpdate<"tournaments">;
export type TournamentParticipantUpdate =
  TablesUpdate<"tournament_participants">;
export type TournamentModeratorUpdate = TablesUpdate<"tournament_moderators">;
export type TournamentBracketUpdate = TablesUpdate<"tournament_brackets">;
export type TournamentMatchUpdate = TablesUpdate<"tournament_matches">;

// Custom types for JSON columns
export type CustomJson = {
  [key: string]: Json | undefined;
};

// Override types for JSON columns
export type OverrideJson<T> = T & {
  structure: CustomJson;
};

// Example usage of override types
export type OverrideTournamentBracket = OverrideJson<TournamentBracket>;

// Utility types for query results
export type QueryResult<T> = {
  data: T | null;
  error: Error | null;
};

{
  /*
// Example utility function for fetching tournaments
export async function fetchTournaments(): Promise<QueryResult<Tournament[]>> {
  // Implementation here
  return { data: null, error: null };
}

// Example utility function for inserting a tournament
export async function insertTournament(
  tournament: TournamentInsert
): Promise<QueryResult<Tournament>> {
  // Implementation here
  return { data: null, error: null };
}

// Example utility function for updating a tournament
export async function updateTournament(
  id: string,
  updates: TournamentUpdate
): Promise<QueryResult<Tournament>> {
  // Implementation here
  return { data: null, error: null };
}

// Example utility function for deleting a tournament
export async function deleteTournament(id: string): Promise<QueryResult<void>> {
  // Implementation here
  return { data: null, error: null };
}
*/
  // biome-ignore lint/complexity/noUselessLoneBlockStatements: <shhhhh>
}
