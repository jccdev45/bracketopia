import type { Tables } from "@/integrations/supabase/generated.types";
import type { BracketStructure } from "@/types/bracket.types";
import type { Participant } from "@/types/participant.types";

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

export const parseStructure = (value: unknown): BracketStructure => {
  if (!isStructure(value)) {
    throw new Error("Invalid structure format");
  }
  return value;
};

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

export const createFirstRoundMatches = (
  participants: Array<Pick<Participant, "id" | "user_id">>,
): Array<
  Pick<
    Tables<"matches">,
    "match_number" | "participant1_id" | "participant2_id" | "round" | "status"
  >
> => {
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

export const createFutureRoundMatches = (
  numRounds: number,
  startingMatchNumber: number,
): Array<
  Pick<
    Tables<"matches">,
    "match_number" | "participant1_id" | "participant2_id" | "round" | "status"
  >
> => {
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
