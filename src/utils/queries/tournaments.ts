import {
  fetchTournamentFn,
  fetchTournamentNamesFn,
  fetchTournamentStatsFn,
  fetchTournamentsFn,
} from "@/utils/serverFn/tournaments";
import { queryOptions } from "@tanstack/react-query";

export const tournamentQueryOptions = {
  list: () =>
    queryOptions({
      queryKey: ["tournaments", "list"],
      queryFn: async () => fetchTournamentsFn(),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: ["tournaments", "detail", id],
      queryFn: async () => fetchTournamentFn({ data: id }),
    }),
  stats: () =>
    queryOptions({
      queryKey: ["tournaments", "stats"],
      queryFn: async () => fetchTournamentStatsFn(),
    }),
  titles: () =>
    queryOptions({
      queryKey: ["tournaments", "titles"],
      queryFn: async () => fetchTournamentNamesFn(),
    }),
};

// NOTE: Use as reference maybe
// export function useAddTournamentMutation() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: addTournamentFn,
//     onMutate: async (variables) => {
//       await queryClient.cancelQueries()
//       queryClient.setQueryData(
//         tournamentQueryOptions.list().queryKey,
//         (tournament) => tournament
//       )
//     }
//   });
// }
