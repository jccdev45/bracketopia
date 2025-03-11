import { createClient } from "@/integrations/supabase/server";
import type {
  FullTournament,
  Structure,
  TournamentInsert,
} from "@/types/tournament.types";
import { createServerFn } from "@tanstack/react-start";

export const fetchTournaments = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  },
);

export const fetchTournament = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data: id }): Promise<FullTournament> => {
    const supabase = createClient();

    // Fetch tournament data with participants
    const { data: tournamentData, error: tournamentError } = await supabase
      .from("tournaments")
      .select(
        `
        *,
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
      throw new Error(`Failed to fetch tournament: ${tournamentError.message}`);
    }

    const { profiles, tournament_brackets, tournament_participants } =
      tournamentData;

    // Return combined data
    return {
      ...tournamentData,
      creator: profiles,
      tournament_brackets: tournament_brackets ? [tournament_brackets] : [],
      tournament_participants: tournament_participants,
      tournament_moderators: [],
    };
  });

export const addTournament = createServerFn({ method: "POST" })
  .validator((d: TournamentInsert) => d)
  .handler(async ({ data }): Promise<FullTournament> => {
    const supabase = createClient();

    // Validate max_participants
    if (data.max_participants <= 0) {
      throw new Error("max_participants must be a positive number");
    }

    // Insert tournament
    const { data: tournamentData, error } = await supabase
      .from("tournaments")
      .insert({
        title: data.title,
        description: data.description || null,
        max_participants: data.max_participants,
        creator_id: data.creator_id,
        registration_open: data.registration_open || true, // Default to true if not provided
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to insert tournament: ${error.message}`);
    }

    // Return the inserted tournament
    return {
      ...tournamentData,
      creator: null, // Creator data can be fetched separately if needed
      tournament_participants: [],
      tournament_brackets: [],
      tournament_moderators: [],
    };
  });
