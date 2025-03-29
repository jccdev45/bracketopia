import { createClient } from "@/integrations/supabase/server";
import type { ModeratorWithProfile } from "@/types/moderator.types";
import type { ParticipantWithProfile } from "@/types/participant.types";
import type { Profile } from "@/types/profile.types";
import type { Tournament, TournamentInsert } from "@/types/tournament.types";
import { parseStructure } from "@/utils/helpers/brackets";
import { createServerFn } from "@tanstack/react-start";
// NOTE: for temp function
// import { faker } from "@snaplet/copycat";

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
      .select("max_participants, registration_open");

    if (error) {
      console.error("Supabase error: ", error);
      throw new TournamentError(
        "Unable to retrieve tournament stats.",
        "TOURNAMENT_STATS_FETCH_FAILED",
      );
    }

    return {
      totalTournaments: data.length,
      totalParticipantSlots: data.reduce(
        (acc, t) => acc + (t.max_participants || 0),
        0,
      ),
      openTournaments: data.filter((t) => t.registration_open).length,
    };
  },
);

export const fetchTournamentsFn = createServerFn({
  method: "GET",
}).handler(async () => {
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
        creator_id,
        created_at,
        updated_at,
        category
      `,
    )
    .limit(10)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error: ", error);
    throw new TournamentError(
      "Unable to retrieve tournaments.",
      "TOURNAMENT_FETCH_FAILED",
    );
  }

  return data;
});

export const fetchTournamentsWithProfileFn = createServerFn({
  method: "GET",
}).handler(async () => {
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
    .limit(10)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error: ", error);
    throw new TournamentError(
      "Unable to retrieve tournaments.",
      "TOURNAMENT_FETCH_FAILED",
    );
  }

  return data as Array<
    Pick<
      Tournament,
      | "id"
      | "title"
      | "registration_open"
      | "description"
      | "max_participants"
      | "created_at"
    > & {
      profiles: Pick<Profile, "id" | "username">;
    }
  >;
});

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
        category,
        profiles (
          id,
          username,
          avatar_url,
          created_at,
          updated_at
        ),
        participants (
          id,
          tournament_id,
          user_id,
          created_at,
          seed,
          status,
          updated_at,
          profiles!inner (
            id,
            username,
            avatar_url,
            created_at,
            updated_at
          )
        ),
        brackets (
          id,
          tournament_id,
          structure,
          current_round,
          created_at,
          updated_at
        ),
         moderators (
          id,
          user_id,
          tournament_id,
          created_at,
          profiles!inner (
            id,
            username,
            avatar_url,
            created_at,
            updated_at
          )
        )
      `,
      )
      .eq("id", id)
      .single();

    if (tournamentError) {
      console.error("Supabase error: ", tournamentError);
      throw new TournamentError(
        "Unable to retrieve tournament information.",
        "TOURNAMENT_FETCH_FAILED",
      );
    }

    // Handle the case where no tournament is found.
    if (!tournamentData) {
      throw new TournamentError(
        "Tournament not found.",
        "TOURNAMENT_NOT_FOUND",
      );
    }

    const { profiles, brackets, participants, moderators } = tournamentData;

    const formattedTournamentData = {
      ...tournamentData,
      creator: profiles,
      brackets: Array.isArray(brackets)
        ? brackets.map((bracket) => ({
            ...bracket,
            structure: parseStructure(bracket.structure),
          }))
        : [],
      participants: (participants as ParticipantWithProfile[]) || [],
      moderators: (moderators as ModeratorWithProfile[]) || [],
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
      participants: [],
      brackets: [],
      moderators: [],
    };
  });

export const fetchTournamentFormInfoFn = createServerFn({
  method: "GET",
}).handler(async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("tournaments").select(`
      title,
      category
    `);

  if (error) {
    console.error("Supabase error: ", error);
    throw new TournamentError(
      "Unable to retrieve tournament names.",
      "TOURNAMENT_NAMES_FETCH_FAILED",
    );
  }

  return data;
});

// NOTE: temp function to manually bulk edit incorrect seeded data 😬
// export const tempUpdateTournamentFn = createServerFn({
//   method: "POST",
// }).handler(async () => {
//   const supabase = createClient();

//   try {
//     const { data: tournamentIds, error: idError } = await supabase
//       .from("tournaments")
//       .select(`
//         id,
//         profiles (
//           id
//         )
//       `);

//     if (idError) {
//       console.error("Error fetching tournament IDs:", idError);
//       throw new TournamentError(
//         "Failed to fetch tournament IDs for update.",
//         "FETCH_IDS_FAILED",
//       );
//     }

//     await Promise.all(
//       tournamentIds.map(async (tournament) => {
//         const { error: tournError } = await supabase
//           .from("tournaments")
//           .update({
//             creator_id: tournament.profiles.id,
//             title: `Tournament ${faker.number.int({
//               min: 1,
//               max: 50,
//             })}`,
//             description: faker.lorem.sentence(),
//             max_participants: faker.number.int({
//               min: 10,
//               max: 100,
//             }),
//             registration_open: faker.datatype.boolean(),
//           })
//           .eq("id", tournament.id);

//         if (tournError) {
//           console.error(
//             `Error updating tournament ${tournament.id}:`,
//             tournError,
//           );
//           throw new TournamentError(
//             "Failed to update tournament.",
//             "UPDATE_FAILED",
//           );
//         }
//       }),
//     );

//     const { data: bracketIds, error: bracketFetchError } = await supabase
//       .from("brackets")
//       .select("id");

//     if (bracketFetchError) {
//       console.error("Error fetching bracket IDs:", bracketFetchError);
//       throw new TournamentError(
//         "Failed to fetch bracket IDs for update.",
//         "FETCH_BRACKET_IDS_FAILED",
//       );
//     }

//     await Promise.all(
//       bracketIds.map(async (bracket) => {
//         const { error: bracketError } = await supabase
//           .from("brackets")
//           .update({
//             structure: {
//               rounds: faker.number.int({
//                 min: 1,
//                 max: 5,
//               }),
//               matches: [],
//             },
//             current_round: faker.number.int({
//               min: 1,
//               max: 5,
//             }),
//           })
//           .eq("id", bracket.id);

//         if (bracketError) {
//           console.error(`Error updating bracket ${bracket.id}:`, bracketError);
//         }
//       }),
//     );
//     console.log("Tournaments and brackets updated successfully.");
//     return { success: true };
//   } catch (error) {
//     console.error("Error updating tournaments:", error);
//     throw new TournamentError(
//       "An unexpected error occurred during the update.",
//       "UNEXPECTED_ERROR",
//     );
//   }

//   // const { error: partError } = await supabase
//   //   .from("brackets")
//   //   .update({
//   //     structure: {
//   //       rounds: faker.number.int({
//   //         min: 1,
//   //         max: 5,
//   //       }),
//   //     },
//   //     current_round: faker.number.int({
//   //       min: 1,
//   //       max: 5,
//   //     }),
//   //   });

//   // if (tournError || partError) {
//   //   const error = tournError || partError;
//   //   console.error("Supabase error: ", error);
//   //   throw new TournamentError(
//   //     "Unable to update tournament.",
//   //     "TOURNAMENT_UPDATE_FAILED",
//   //   );
//   // }
// });
