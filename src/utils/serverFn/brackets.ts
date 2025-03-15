// src/utils/serverFn/brackets.ts
import { createClient } from "@/integrations/supabase/server";
import type {
  BracketWithStructure,
  FetchBracketParams,
  GenerateBracketParams,
  MatchWithParticipants,
} from "@/types/tournament.types";
import {
  calculateTournamentStructure,
  createFirstRoundMatches,
  createFutureRoundMatches,
  parseStructure,
} from "@/utils/helpers/brackets";
import { createServerFn } from "@tanstack/react-start";

export const generateBracketFn = createServerFn({ method: "POST" })
  .validator((d: Omit<GenerateBracketParams, "matches">) => d)
  .handler(async ({ data: { tournamentId, participants } }) => {
    const supabase = createClient();
    const { numRounds } = calculateTournamentStructure(participants.length);

    try {
      // Delete existing bracket and matches if they exist
      const { error: deleteMatchError } = await supabase
        .from("matches")
        .delete()
        .eq("tournament_id", tournamentId);

      if (deleteMatchError) {
        throw new Error(
          `Failed to clean up old matches: ${deleteMatchError.message}`,
        );
      }

      const { error: deleteBracketError } = await supabase
        .from("brackets")
        .delete()
        .eq("tournament_id", tournamentId);

      if (deleteBracketError) {
        throw new Error(
          `Failed to clean up old bracket: ${deleteBracketError.message}`,
        );
      }

      // Create first round matches
      const firstRoundMatches = createFirstRoundMatches(participants);
      const futureRoundMatches = createFutureRoundMatches(
        numRounds,
        firstRoundMatches.length + 1,
      );
      const allMatches = [...firstRoundMatches, ...futureRoundMatches];

      // Create bracket structure
      const structure = {
        rounds: numRounds,
        matches: allMatches.map((match) => ({
          match_number: match.match_number,
          round: match.round,
          participant1_id: match.participant1_id,
          participant2_id: match.participant2_id,
          status: match.status as "pending" | "completed",
        })),
      };

      // Create bracket
      const { data: bracket, error: bracketError } = await supabase
        .from("brackets")
        .insert({
          tournament_id: tournamentId,
          structure, // Insert the *parsed* structure.
          current_round: 1,
        })
        .select()
        .single(); // Use .single() for a single row.

      if (bracketError || !bracket) {
        throw new Error(
          bracketError?.message ?? "Failed to create tournament bracket",
        );
      }

      // Create matches.  We now use `allMatches` here.
      const matchInserts = allMatches.map((match) => ({
        ...match, // Keep existing properties
        tournament_id: tournamentId,
        bracket_id: bracket.id,
      }));

      const { data: matches, error: matchError } = await supabase
        .from("matches")
        .insert(matchInserts)
        .select(`
          id,
          match_number,
          round,
          status,
          score_participant1,
          score_participant2,
          tournament_id,
          bracket_id,
          participant1:participants!participant1_id(
            id,
            profiles!inner(id, username, avatar_url, created_at, updated_at)
          ),
          participant2:participants!participant2_id(
            id,
            profiles!inner(id, username, avatar_url, created_at, updated_at)
          ),
          winner:participants!winner_id(
            id,
            profiles!inner(id, username, avatar_url, created_at, updated_at)
          )
        `)
        .order("round", { ascending: true })
        .order("match_number", { ascending: true });

      if (matchError) {
        throw new Error(`Failed to create matches: ${matchError.message}`);
      }

      return {
        ...bracket,
        structure,
        matches: (matches as MatchWithParticipants[]) || [],
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate bracket: ${error.message}`);
      }
      throw error;
    }
  });

export const fetchBracketFn = createServerFn({ method: "GET" })
  .validator((d: FetchBracketParams) => d)
  .handler(
    async ({
      data: { tournamentId },
    }): Promise<
      BracketWithStructure & {
        matches: MatchWithParticipants[];
      }
    > => {
      const supabase = createClient();

      // First get the bracket data
      const { data: bracket, error: bracketError } = await supabase
        .from("brackets")
        .select("*") // Select all bracket columns
        .eq("tournament_id", tournamentId)
        .single(); // Expect a single bracket.

      if (bracketError || !bracket) {
        throw new Error(
          bracketError?.message ?? "No bracket found for this tournament",
        );
      }

      // Then get all matches with participant data
      const { data: matches, error: matchError } = await supabase
        .from("matches")
        .select(`
          *,
          participant1:participants!participant1_id(
            id,
            profiles!inner(id, username, avatar_url, created_at, updated_at)
          ),
          participant2:participants!participant2_id(
            id,
            profiles!inner(id, username, avatar_url, created_at, updated_at)
          ),
          winner:participants!winner_id(
            id,
            profiles!inner(id, username, avatar_url, created_at, updated_at)
          )
        `)
        .eq("tournament_id", tournamentId)
        .eq("bracket_id", bracket.id)
        .order("round", { ascending: true })
        .order("match_number", { ascending: true });

      if (matchError) {
        throw new Error(`Failed to fetch matches: ${matchError.message}`);
      }

      // Parse the JSON structure.  This is important!
      const structure = parseStructure(bracket.structure);

      return {
        ...bracket,
        structure,
        matches: (matches as MatchWithParticipants[]) || [], // Cast to your combined type.
      } as BracketWithStructure & {
        matches: MatchWithParticipants[];
      };
    },
  );
