// src/utils/serverFn/brackets.ts
import { createClient } from "@/integrations/supabase/server";
import type {
  BracketStructure,
  BracketWithStructure,
  FetchBracketParams,
  GenerateBracketParams,
} from "@/types/bracket.types";
import type { MatchStatus, MatchWithParticipants } from "@/types/match.types";
import {
  calculateTournamentStructure,
  createFirstRoundMatches,
  createFutureRoundMatches,
} from "@/utils/helpers/brackets";
import { createServerFn } from "@tanstack/react-start";

/**
 * Custom error class for bracket-related errors
 */
class BracketError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

/**
 * Generates a new bracket for a tournament with initial matches
 * @param tournamentId - The ID of the tournament
 * @param participants - Array of participants to create matches for
 * @returns The generated bracket with matches
 * @throws {BracketError} If there's an error generating the bracket
 */
export const generateBracketFn = createServerFn({ method: "POST" })
  .validator(
    (d: {
      tournamentId: string;
      participants: GenerateBracketParams["participants"];
    }) => d,
  )
  .handler(async ({ data: { tournamentId, participants } }) => {
    const supabase = createClient();
    const { numRounds } = calculateTournamentStructure(participants.length);

    try {
      // Create first round matches to get their structure
      const firstRoundMatches = createFirstRoundMatches(participants);
      const futureRoundMatches = createFutureRoundMatches(
        numRounds,
        firstRoundMatches.length + 1,
      );

      // Create the bracket with the complete structure
      const structure = {
        rounds: numRounds,
        matches: [...firstRoundMatches, ...futureRoundMatches].map((match) => ({
          match_number: match.match_number,
          round: match.round,
          participant1_id: match.participant1_id,
          participant2_id: match.participant2_id,
          status: match.status as MatchStatus,
        })),
      };

      const { data: bracket, error: bracketError } = await supabase
        .from("brackets")
        .insert({
          tournament_id: tournamentId,
          structure: JSON.stringify(structure),
          current_round: 1,
        })
        .select()
        .single();

      if (bracketError) {
        throw new BracketError(
          "Failed to create bracket",
          "BRACKET_CREATION_FAILED",
        );
      }

      // Add tournament and bracket IDs to matches
      const matchesWithIds = firstRoundMatches.map((match) => ({
        ...match,
        tournament_id: tournamentId,
        bracket_id: bracket.id,
      }));

      const { error: matchError } = await supabase
        .from("matches")
        .insert(matchesWithIds);

      if (matchError) {
        throw new BracketError(
          "Failed to create initial matches",
          "MATCH_CREATION_FAILED",
        );
      }

      // Add tournament and bracket IDs to future matches
      const futureMatchesWithIds = futureRoundMatches.map((match) => ({
        ...match,
        tournament_id: tournamentId,
        bracket_id: bracket.id,
      }));

      if (futureMatchesWithIds.length > 0) {
        const { error: futureMatchError } = await supabase
          .from("matches")
          .insert(futureMatchesWithIds);

        if (futureMatchError) {
          throw new BracketError(
            "Failed to create future matches",
            "FUTURE_MATCH_CREATION_FAILED",
          );
        }
      }

      return {
        ...bracket,
        structure,
      };
    } catch (error) {
      if (error instanceof BracketError) {
        throw error;
      }
      throw new BracketError(
        "An unexpected error occurred while generating the bracket",
        "BRACKET_GENERATION_FAILED",
      );
    }
  });

/**
 * Fetches a bracket and its matches for a tournament
 * @param tournamentId - The ID of the tournament
 * @returns The bracket with its matches, or null if not found
 * @throws {BracketError} If there's an error fetching the bracket
 */
export const fetchBracketFn = createServerFn({ method: "GET" })
  .validator((d: FetchBracketParams) => d)
  .handler(
    async ({
      data: { tournamentId },
    }): Promise<
      | (BracketWithStructure & {
          matches: MatchWithParticipants[];
        })
      | null
    > => {
      const supabase = createClient();

      const { data: bracket, error: bracketError } = await supabase
        .from("brackets")
        .select("*")
        .eq("tournament_id", tournamentId)
        .maybeSingle();

      if (bracketError) {
        throw new BracketError(
          "Failed to fetch bracket",
          "BRACKET_FETCH_FAILED",
        );
      }

      if (!bracket) {
        return null;
      }

      const { data: matches, error: matchError } = await supabase
        .from("matches")
        .select(`
          *,
          participant1:participants!participant1_id(
            id,
            user_id,
            tournament_id,
            status,
            seed,
            created_at,
            updated_at,
            profiles!inner(id, username, avatar_url, created_at, updated_at)
          ),
          participant2:participants!participant2_id(
            id,
            user_id,
            tournament_id,
            status,
            seed,
            created_at,
            updated_at,
            profiles!inner(id, username, avatar_url, created_at, updated_at)
          ),
          winner:participants!winner_id(
            id,
            user_id,
            tournament_id,
            status,
            seed,
            created_at,
            updated_at,
            profiles!inner(id, username, avatar_url, created_at, updated_at)
          )
        `)
        .eq("tournament_id", tournamentId)
        .eq("bracket_id", bracket.id)
        .order("round", { ascending: true })
        .order("match_number", { ascending: true });

      if (matchError) {
        throw new BracketError("Failed to fetch matches", "MATCH_FETCH_FAILED");
      }

      const parsedStructure = JSON.parse(
        bracket.structure as string,
      ) as BracketStructure;

      return {
        ...bracket,
        structure: parsedStructure,
        matches: matches as MatchWithParticipants[],
      };
    },
  );
