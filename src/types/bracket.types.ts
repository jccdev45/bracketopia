import type {
  BracketStructure,
  MatchWithParticipants,
} from "./tournament.types";

// Bracket data with parsed structure and matches
// Renamed to clarify the purpose, and uses the shared types.
export interface BracketViewData {
  structure: BracketStructure;
  matches: MatchWithParticipants[];
}

// Props for the BracketView component.
export interface BracketViewProps {
  bracket: BracketViewData;
  onUpdateMatch?: (matchId: string, winnerId: string) => void;
}
