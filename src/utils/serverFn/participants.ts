import { createClient } from "@/integrations/supabase/server";
import { createServerFn } from "@tanstack/react-start";

/**
 * Custom error class for participants-related errors
 */
class ParticipantsError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

export const fetchParticipantsWithProfilesFn = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data: tournamentId }) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("participants")
      .select(`
        id,
        user_id,
        tournament_id,
        status,
        seed,
        created_at,
        updated_at,
        profiles!inner(
          id,
          username,
          avatar_url
        )
      `)
      .eq("tournament_id", tournamentId);

    if (error) {
      console.error("❌ Supabase error: ", error);
      throw new ParticipantsError(
        "Unable to retrieve tournament participants.",
        "TOURNAMENT_PARTICIPANTS_FETCH_FAILED",
      );
    }

    return data;
  });

interface AssignParticipantParams {
  tournamentId: string;
  userId: string;
}

export const assignParticipantFn = createServerFn({ method: "POST" })
  .validator((d: AssignParticipantParams) => d)
  .handler(async ({ data: { tournamentId, userId } }) => {
    const supabase = createClient();

    // First check if the participant already exists
    const { data: existingParticipant } = await supabase
      .from("participants")
      .select("id")
      .eq("tournament_id", tournamentId)
      .eq("user_id", userId)
      .single();

    if (existingParticipant) {
      throw new Error("User is already a participant in this tournament");
    }

    // Then check if the tournament is full
    const { data: tournament } = await supabase
      .from("tournaments")
      .select("max_participants, participants(count)")
      .eq("id", tournamentId)
      .single();

    if (!tournament) {
      throw new Error("Tournament not found");
    }

    const currentParticipants = tournament.participants[0].count;
    if (currentParticipants >= tournament.max_participants) {
      throw new Error("Tournament is full");
    }

    // If all checks pass, create the participant
    const { data: participant, error } = await supabase
      .from("participants")
      .insert({
        tournament_id: tournamentId,
        user_id: userId,
        status: "pending", // You might want to adjust this based on your needs
      })
      .select(`
        id,
        status,
        user_id,
        profiles (
          id,
          username,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error(`There was an error: ${error.message}`);
      throw error;
    }

    return participant;
  });
