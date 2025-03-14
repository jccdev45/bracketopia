import { createClient } from "@/integrations/supabase/server";
import type { BracketData, BracketStructure, GenerateBracketParams } from "@/types/bracket.types";
import { calculateTournamentStructure, createFirstRoundMatches, createFutureRoundMatches } from "@/utils/helpers/brackets";
import { createServerFn } from "@tanstack/react-start";

export const generateBracketFn = createServerFn({ method: "POST" })
  .validator((d: GenerateBracketParams) => d)
  .handler(async ({ data: { tournamentId, participants } }) => {
    const supabase = createClient();
    const { numRounds } = calculateTournamentStructure(participants.length);

    try {
      // Delete existing bracket and matches if they exist
      const { error: deleteMatchError } = await supabase
        .from("tournament_matches")
        .delete()
        .eq("tournament_id", tournamentId);

      if (deleteMatchError) {
        throw new Error(`Failed to clean up old matches: ${deleteMatchError.message}`);
      }

      const { error: deleteBracketError } = await supabase
        .from("tournament_brackets")
        .delete()
        .eq("tournament_id", tournamentId);

      if (deleteBracketError) {
        throw new Error(`Failed to clean up old bracket: ${deleteBracketError.message}`);
      }

      // Create first round matches
      const firstRoundMatches = createFirstRoundMatches(participants);
      const futureRoundMatches = createFutureRoundMatches(numRounds, firstRoundMatches.length + 1);
      const allMatches = [...firstRoundMatches, ...futureRoundMatches];

      // Create bracket structure
      const structure = {
        rounds: numRounds,
        matches: allMatches.map(match => ({
          match_number: match.match_number,
          round: match.round,
          participant1_id: match.participant1_id,
          participant2_id: match.participant2_id,
          status: match.status as "pending" | "completed",
        })),
      };

      // Create bracket
      const { data: bracket, error: bracketError } = await supabase
        .from("tournament_brackets")
        .insert({
          tournament_id: tournamentId,
          structure: structure,
          current_round: 1,
        })
        .select()
        .single()
        .overrideTypes<{
          structure: BracketStructure
        }>()

      if (bracketError || !bracket) {
        throw new Error(
          bracketError?.message ?? "Failed to create tournament bracket",
        );
      }

      // Create matches
      const matchInserts = allMatches.map((match) => ({
        ...match,
        tournament_id: tournamentId,
        bracket_id: bracket.id,
      }));

      const { data: matches, error: matchError } = await supabase
        .from("tournament_matches")
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
          participant1:tournament_participants!participant1_id(
            id,
            user:profiles(id, username)
          ),
          participant2:tournament_participants!participant2_id(
            id,
            user:profiles(id, username)
          ),
          winner:tournament_participants!winner_id(
            id,
            user:profiles(id, username)
          )
        `)
        .order("round", { ascending: true })
        .order("match_number", { ascending: true })

      if (matchError) {
        throw new Error(`Failed to create matches: ${matchError.message}`);
      }

      return {
        ...bracket,
        structure,
        matches: matches || [],
      } as BracketData;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to generate bracket: ${error.message}`
          : "Failed to generate bracket",
      );
    }
  });

export const fetchBracketFn = createServerFn({ method: "GET" })
  .validator((d: { tournamentId: string }) => d)
  .handler(async ({ data: { tournamentId } }) => {
    const supabase = createClient();
    console.log("🚀🚀🚀", tournamentId)
    // First get the bracket data
    const { data: bracket, error: bracketError } = await supabase
      .from("tournament_brackets")
      .select("id,current_round,created_at,updated_at,tournament_id")
      .eq("tournament_id", tournamentId)
      .single();
    if (bracketError || !bracket) {
      throw new Error(
        bracketError?.message ?? "No bracket found for this tournament",
      );
    }

    // Then get all matches with participant data
    const { data: matches, error: matchError } = await supabase
      .from("tournament_matches")
      .select(`
        id,
        match_number,
        round,
        status,
        score_participant1,
        score_participant2,
        tournament_id,
        bracket_id,
        participant1:tournament_participants!participant1_id(
          id,
          user:profiles(id, username)
        ),
        participant2:tournament_participants!participant2_id(
          id,
          user:profiles(id, username)
        ),
        winner:tournament_participants!winner_id(
          id,
          user:profiles(id, username)
        )
      `)
      .eq("tournament_id", tournamentId)
      .eq("bracket_id", bracket.id)
      .order("round", { ascending: true })
      .order("match_number", { ascending: true })

    if (matchError) {
      throw new Error(`Failed to fetch matches: ${matchError.message}`);
    }

    // Calculate rounds from matches
    const maxRound = Math.max(...(matches?.map(m => m.round) || [1]));
    
    // Build structure from matches
    const structure = {
      rounds: maxRound,
      matches: (matches || []).map(match => ({
        match_number: match.match_number,
        round: match.round,
        participant1_id: match.participant1?.id || null,
        participant2_id: match.participant2?.id || null,
        status: match.status as "pending" | "completed",
      })),
    };

    return {
      ...bracket,
      structure,
      matches: matches || [],
    }
  });
