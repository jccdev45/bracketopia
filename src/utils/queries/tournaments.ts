import { QUERY_CACHE_TIMES } from "@/constants/query-constants";
import {
  fetchTournamentFn,
  fetchTournamentFormInfoFn,
  fetchTournamentStatsFn,
  fetchTournamentsWithProfileFn,
} from "@/utils/serverFn/tournaments";
import { queryOptions } from "@tanstack/react-query";

const { ONE_MINUTE, FIFTEEN_MINUTES } = QUERY_CACHE_TIMES;

export const tournamentQueryOptions = {
  list: () =>
    queryOptions({
      queryKey: ["tournaments", "list"],
      queryFn: async () => fetchTournamentsWithProfileFn(),
      staleTime: ONE_MINUTE,
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: ["tournaments", "detail", id],
      queryFn: async () => fetchTournamentFn({ data: id }),
      staleTime: ONE_MINUTE,
    }),
  stats: () =>
    queryOptions({
      queryKey: ["tournaments", "stats"],
      queryFn: async () => fetchTournamentStatsFn(),
      staleTime: ONE_MINUTE,
    }),
  form: () =>
    queryOptions({
      queryKey: ["tournaments", "titles"],
      queryFn: async () => fetchTournamentFormInfoFn(),
      staleTime: FIFTEEN_MINUTES,
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
