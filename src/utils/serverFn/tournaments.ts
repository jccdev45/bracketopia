import { createClient } from "@/integrations/supabase/server";
import type {
  Structure,
  TournamentInsert,
  TournamentStats,
  TournamentWithDetails,
} from "@/types/tournament.types";
import { createServerFn } from "@tanstack/react-start";

class TournamentError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "TournamentError";
  }
}

export const fetchTournamentStatsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tournaments")
      .select("max_participants");

    if (error) {
      console.error("Supabase error: ", error);
      throw new TournamentError(
        "Unable to retrieve tournament stats.",
        "TOURNAMENT_STATS_FETCH_FAILED",
      );
    }

    const stats: TournamentStats = {
      totalTournaments: data.length,
      totalParticipantSlots: data.reduce(
        (acc, t) => acc + (t.max_participants || 0),
        0,
      ),
    };

    return stats;
  },
);

export const fetchTournamentsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tournaments")
      .select(
        `
        id,
        title,
        registration_open,
        description,
        max_participants,
        profiles (
          id,
          username
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error: ", error);
      throw new TournamentError(
        "Unable to retrieve tournaments.",
        "TOURNAMENT_FETCH_FAILED",
      );
    }

    return data;
  },
);

export const fetchTournamentFn = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data: id }) => {
    const supabase = createClient();

    const { data: tournamentData, error: tournamentError } = await supabase
      .from("tournaments")
      .select(
        `
        id,
        creator_id,
        title,
        description,
        max_participants,
        registration_open,
        created_at,
        updated_at,
        profiles (
          id,
          username,
          avatar_url,
          updated_at,
          created_at
        ),
        tournament_participants (
          id,
          tournament_id,
          user_id,
          created_at,
          seed,
          status,
          updated_at
        ),
        tournament_brackets (
          id,
          tournament_id,
          structure,
          current_round,
          created_at,
          updated_at
        )
      `,
      )
      .eq("id", id)
      .single()
      .overrideTypes<{
        tournament_brackets: {
          structure: Structure;
          id: string;
          tournament_id: string;
          created_at: string;
          updated_at: string;
          current_round: number | null;
        };
      }>();

    if (tournamentError) {
      console.error("Supabase error: ", tournamentError);
      throw new TournamentError(
        "Unable to retrieve tournament information.",
        "TOURNAMENT_FETCH_FAILED",
      );
    }

    const { profiles, tournament_brackets, tournament_participants } =
      tournamentData;

    const formattedTournamentData: TournamentWithDetails = {
      ...tournamentData,
      creator: profiles,
      tournament_brackets: tournament_brackets ? [tournament_brackets] : [],
      tournament_participants: tournament_participants || [], // if possible for this to be undefined or null
      tournament_moderators: [],
    };

    return formattedTournamentData;
  });

export const addTournamentFn = createServerFn({ method: "POST" })
  .validator((d: TournamentInsert) => {
    if (d.max_participants <= 0) {
      throw new TournamentError(
        "max_participants must be a positive number",
        "INVALID_MAX_PARTICIPANTS",
      );
    }
    return d;
  })
  .handler(async ({ data }) => {
    const supabase = createClient();

    const { data: tournamentData, error } = await supabase
      .from("tournaments")
      .insert({
        title: data.title,
        description: data.description || null,
        max_participants: data.max_participants,
        creator_id: data.creator_id,
        registration_open: data.registration_open || true,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error: ", error);
      throw new TournamentError(
        "Unable to create tournament.",
        "TOURNAMENT_CREATE_FAILED",
      );
    }

    return {
      ...tournamentData,
      tournament_participants: [],
      tournament_brackets: [],
      tournament_moderators: [],
    };
  });

export const fetchTournamentNamesFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("tournaments").select("title");

    if (error) {
      console.error("Supabase error: ", error);
      throw new TournamentError(
        "Unable to retrieve tournament names.",
        "TOURNAMENT_NAMES_FETCH_FAILED",
      );
    }

    return data;
  },
);
