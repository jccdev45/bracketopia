import {
  assignParticipantFn,
  fetchParticipantsWithProfilesFn,
} from "@/utils/serverFn/participants";
import { type MutationOptions, queryOptions } from "@tanstack/react-query";

export const participantsQueryOptions = {
  list: (tournamentId: string) =>
    queryOptions({
      queryKey: ["participants", tournamentId],
      queryFn: () => fetchParticipantsWithProfilesFn({ data: tournamentId }),
    }),
};

export const participantMutationOptions = {
  assign: (): MutationOptions<
    unknown,
    Error,
    { tournamentId: string; userId: string }
  > => ({
    mutationFn: (data) => assignParticipantFn({ data }),
  }),
};

// interface Participant {
//   id: string;
//   user_id: string;
//   username: string;
// }

// export const participantsQueryOptions = queryOptions({
//   queryKey: ['participants'],
//   queryFn: async ({ tournamentId }: { tournamentId: string }): Promise<Participant[]> => {
//     const supabase = createClient()
//     const { data, error } = await supabase
//       .from('participants')
//       .select(`
//         id,
//         user_id,
//         profiles!inner(id, username)
//       `)
//       .eq('tournament_id', tournamentId);

//     if (error) throw error;

//     return data.map((participant: any): Participant => ({
//       id: participant.id,
//       user_id: participant.user_id,
//       username: participant.profiles.username,
//     }));
//   },
// });

// export type { Participant };
