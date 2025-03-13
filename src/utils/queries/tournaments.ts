import {
  fetchTournamentFn,
  fetchTournamentNamesFn,
  fetchTournamentStatsFn,
  fetchTournamentsFn,
} from "@/utils/serverFn/tournaments";
import { queryOptions } from "@tanstack/react-query";

const ONE_MIN = 60000;

export const tournamentQueryOptions = {
  list: () =>
    queryOptions({
      queryKey: ["tournaments", "list"],
      queryFn: async () => fetchTournamentsFn(),
      staleTime: ONE_MIN, // 1 min
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: ["tournaments", "detail", id],
      queryFn: async () => fetchTournamentFn({ data: id }),
      staleTime: ONE_MIN, // 1 min
    }),
  stats: () =>
    queryOptions({
      queryKey: ["tournaments", "stats"],
      queryFn: async () => fetchTournamentStatsFn(),
      staleTime: ONE_MIN, // 1 min
    }),
  titles: () =>
    queryOptions({
      queryKey: ["tournaments", "titles"],
      queryFn: async () => fetchTournamentNamesFn(),
      staleTime: ONE_MIN * 15, // 15 min
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
