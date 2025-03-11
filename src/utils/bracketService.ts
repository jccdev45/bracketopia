import { createClient } from "@/integrations/supabase/server";
import type {
  Structure,
  TournamentBracket,
  TournamentBracketInsert,
  TournamentMatch,
  TournamentParticipant,
} from "@/types/tournament.types";
import { createServerFn } from "@tanstack/react-start";

interface GenerateBracketParams {
  tournamentId: string;
  participants: Pick<TournamentParticipant, "id" | "user_id">[];
}

interface UpdateMatchResultParams {
  tournamentId: string;
  matchId: string;
  score1: number;
  score2: number;
  winnerId: string;
}

interface FetchBracketParams {
  tournamentId: string;
}

interface BracketMatch {
  match_number: number;
  round: number;
  status: string;
  participant1_id: string | null;
  participant2_id: string | null;
}

export interface BracketMatchWithParticipants extends Omit<TournamentMatch, "participant1" | "participant2" | "winner"> {
  participant1: { id: string; user: { id: string; username: string } } | null;
  participant2: { id: string; user: { id: string; username: string } } | null;
  winner: { id: string; user: { id: string; username: string } } | null;
}

export interface BracketData extends TournamentBracket {
  matches: BracketMatchWithParticipants[];
}

/**
 * Type guard to check if a value is a Structure
 */
const isStructure = (value: unknown): value is Structure => {
  if (!value || typeof value !== "object") return false;
  const struct = value as Partial<Structure>;
  return (
    typeof struct.rounds === "number" &&
    Array.isArray(struct.matches) &&
    struct.matches.every(
      (match) =>
        typeof match === "object" &&
        match !== null &&
        typeof match.match_number === "number" &&
        typeof match.round === "number" &&
        typeof match.status === "string",
    )
  );
};

/**
 * Safely converts JSON to Structure type
 */
const parseStructure = (value: unknown): Structure => {
  if (!isStructure(value)) {
    throw new Error("Invalid structure format");
  }
  return value;
};

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
const shuffleParticipants = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Calculates tournament structure based on number of participants
 */
const calculateTournamentStructure = (
  numParticipants: number,
): {
  numRounds: number;
  totalMatches: number;
} => {
  const numRounds = Math.ceil(Math.log2(numParticipants));
  const totalMatches = 2 ** numRounds - 1;
  return { numRounds, totalMatches };
};

/**
 * Creates first round matches from participants
 */
const createFirstRoundMatches = (
  participants: Pick<TournamentParticipant, "id" | "user_id">[],
): BracketMatch[] => {
  const matches: BracketMatch[] = [];
  for (let i = 0; i < participants.length; i += 2) {
    const participant1 = participants[i] || null;
    const participant2 =
      i + 1 < participants.length ? participants[i + 1] : null;
    matches.push({
      match_number: Math.floor(i / 2) + 1,
      participant1_id: participant1?.id || null,
      participant2_id: participant2?.id || null,
      round: 1,
      status: "pending",
    });
  }
  return matches;
};

/**
 * Creates future round matches
 */
const createFutureRoundMatches = (
  numRounds: number,
  startingMatchNumber: number,
): BracketMatch[] => {
  const matches: BracketMatch[] = [];
  let currentMatchNumber = startingMatchNumber;

  for (let round = 2; round <= numRounds; round++) {
    const matchesInRound = 2 ** (numRounds - round);
    for (let i = 0; i < matchesInRound; i++) {
      matches.push({
        match_number: currentMatchNumber++,
        participant1_id: null,
        participant2_id: null,
        round,
        status: "pending",
      });
    }
  }
  return matches;
};

/**
 * Generates a tournament bracket structure based on participants
 */
export const generateBracket = createServerFn({ method: "POST" })
  .validator((d: GenerateBracketParams) => d)
  .handler(async ({ data: { tournamentId, participants } }): Promise<TournamentBracket> => {
    const supabase = createClient();
    const shuffledParticipants = shuffleParticipants(participants);
    const { numRounds } = calculateTournamentStructure(participants.length);

    const firstRoundMatches = createFirstRoundMatches(shuffledParticipants);
    const futureRoundMatches = createFutureRoundMatches(
      numRounds,
      firstRoundMatches.length + 1,
    );

    const matches = [...firstRoundMatches, ...futureRoundMatches];
    const structure = {
      rounds: numRounds,
      matches,
    };

    try {
      const { data: bracketData, error: bracketError } = await supabase
        .from("tournament_brackets")
        .insert({
          tournament_id: tournamentId,
          structure: JSON.stringify(structure),
          current_round: 1,
        } satisfies TournamentBracketInsert)
        .select()
        .single();

      if (bracketError || !bracketData) {
        throw new Error(bracketError?.message ?? "Failed to create tournament bracket");
      }

      const { error: matchError } = await supabase
        .from("tournament_matches")
        .insert(
          matches.map((match) => ({
            ...match,
            tournament_id: tournamentId,
            bracket_id: bracketData.id,
          })),
        );

      if (matchError) {
        throw new Error(matchError.message);
      }

      return {
        id: bracketData.id,
        tournament_id: bracketData.tournament_id,
        created_at: bracketData.created_at,
        updated_at: bracketData.updated_at,
        current_round: bracketData.current_round,
        structure: parseStructure(JSON.parse(bracketData.structure as string)),
      };
    } catch (error) {
      console.error("Error generating bracket:", error);
      throw error;
    }
  });

/**
 * Fetches bracket data for a tournament
 */
export const fetchBracket = createServerFn({ method: "GET" })
  .validator((d: FetchBracketParams) => d)
  .handler(async ({ data: { tournamentId } }): Promise<BracketData | null> => {
    const supabase = createClient();
    try {
      const { data: bracketData } = await supabase
        .from("tournament_brackets")
        .select()
        .eq("tournament_id", tournamentId)
        .single()
        .throwOnError();

      if (!bracketData) return null;

      const { data: matchesData } = await supabase
        .from("tournament_matches")
        .select(`
          *,
          participant1:tournament_participants!tournament_matches_participant1_id_fkey(
            id,
            user:profiles(id, username)
          ),
          participant2:tournament_participants!tournament_matches_participant2_id_fkey(
            id,
            user:profiles(id, username)
          ),
          winner:tournament_participants!tournament_matches_winner_id_fkey(
            id,
            user:profiles(id, username)
          )
        `)
        .eq("tournament_id", tournamentId)
        .order("round", { ascending: true })
        .order("match_number", { ascending: true })
        .throwOnError();

      const structure = parseStructure(JSON.parse(bracketData.structure as string));

      return {
        id: bracketData.id,
        tournament_id: bracketData.tournament_id,
        created_at: bracketData.created_at,
        updated_at: bracketData.updated_at,
        current_round: bracketData.current_round,
        structure,
        matches: matchesData,
      };
    } catch (error) {
      console.error("Error fetching bracket:", error);
      throw error;
    }
  });

/**
 * Updates match results and advances winners
 */
export const updateMatchResult = createServerFn({ method: "POST" })
  .validator((d: UpdateMatchResultParams) => d)
  .handler(async ({ data: { matchId, score1, score2, winnerId } }): Promise<TournamentMatch> => {
    const supabase = createClient();
    try {
      const { data: matchData } = await supabase
        .from("tournament_matches")
        .update({
          score_participant1: score1,
          score_participant2: score2,
          winner_id: winnerId,
          status: "completed" as const,
        } satisfies Partial<TournamentMatch>)
        .eq("id", matchId)
        .select("*, round, match_number")
        .single()
        .throwOnError();

      if (matchData) {
        const { data: nextMatch } = await supabase
          .from("tournament_matches")
          .select("*")
          .eq("tournament_id", matchData.tournament_id)
          .eq("round", matchData.round + 1)
          .eq("match_number", Math.ceil(matchData.match_number / 2))
          .single();

        if (nextMatch) {
          const isFirstParticipant = matchData.match_number % 2 !== 0;
          const updateField = isFirstParticipant
            ? "participant1_id"
            : "participant2_id";

          await supabase
            .from("tournament_matches")
            .update({ [updateField]: winnerId })
            .eq("id", nextMatch.id)
            .throwOnError();
        }
      }

      return matchData;
    } catch (error) {
      console.error("Error updating match result:", error);
      throw error;
    }
  });
