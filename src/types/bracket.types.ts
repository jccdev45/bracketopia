import type { Profile } from "@/types/profile.types";
import type { TournamentBracket, TournamentMatch, TournamentParticipant } from "./tournament.types";

/**
 * Parameters for generating a bracket
 */
export interface GenerateBracketParams {
  tournamentId: string;
  participants: Array<Pick<TournamentParticipant, "id" | "user_id">>;
}

/**
 * Parameters for updating a match result
 */
export interface UpdateMatchResultParams {
  tournamentId: string;
  matchId: string;
  score1: number;
  score2: number;
  winnerId: string;
}

/**
 * Parameters for fetching a bracket
 */
export interface FetchBracketParams {
  tournamentId: string;
}

/**
 * Participant with user data
 */
export interface ParticipantWithUser {
  id: string;
  user: Profile;
}

/**
 * Structure for tournament brackets
 */
export interface BracketStructure {
  rounds: number;
  matches: Array<{
    match_number: number;
    round: number;
    participant1_id: string | null;
    participant2_id: string | null;
    status: "pending" | "completed";
  }>;
}

/**
 * Match interface for displaying matches in the view
 */
export interface BracketMatchWithParticipants extends Omit<
  TournamentMatch,
  "participant1_id" | "participant2_id" | "winner_id"
> {
  participant1: ParticipantWithUser | null;
  participant2: ParticipantWithUser | null;
  winner: ParticipantWithUser | null;
}

/**
 * Bracket data with parsed structure and matches
 */
export interface BracketData extends Omit<TournamentBracket, "structure"> {
  structure: BracketStructure;
  matches: BracketMatchWithParticipants[];
}
