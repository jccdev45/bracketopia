import type { Tables } from "@/integrations/supabase/generated.types";
import type { BracketStructure } from "@/types/bracket.types";

/**
 * Type guard to check if a value is a BracketStructure
 */
export const isStructure = (value: unknown): value is BracketStructure => {
  if (!value || typeof value !== "object") return false;
  const struct = value as Partial<BracketStructure>;
  return (
    typeof struct.rounds === "number" &&
    Array.isArray(struct.matches) &&
    struct.matches.every(
      (match) =>
        typeof match === "object" &&
        match !== null &&
        typeof match.match_number === "number" &&
        typeof match.round === "number",
    )
  );
};

/**
 * Safely converts JSON to BracketStructure type
 */
export const parseStructure = (value: unknown): BracketStructure => {
  if (!isStructure(value)) {
    throw new Error("Invalid structure format");
  }
  return value;
};

/**
 * Calculates tournament structure based on number of participants
 */
export const calculateTournamentStructure = (
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
export const createFirstRoundMatches = (
  participants: Array<Pick<Tables<"tournament_participants">, "id" | "user_id">>,
): Array<Pick<Tables<"tournament_matches">, "match_number" | "participant1_id" | "participant2_id" | "round" | "status">> => {
  const matches = [];
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
export const createFutureRoundMatches = (
  numRounds: number,
  startingMatchNumber: number,
): Array<Pick<Tables<"tournament_matches">, "match_number" | "participant1_id" | "participant2_id" | "round" | "status">> => {
  const matches = [];
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
