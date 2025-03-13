import {
  fetchProfileFn,
  fetchUserTournamentsFn,
} from "@/utils/serverFn/profiles";
import { queryOptions } from "@tanstack/react-query";

export const profileQueryOptions = {
  single: (userId: string) =>
    queryOptions({
      queryKey: ["profile", "single", userId],
      queryFn: () => fetchProfileFn({ data: userId }),
    }),
  tournaments: (userId: string) =>
    queryOptions({
      queryKey: ["profile", "tournaments", userId],
      queryFn: () => fetchUserTournamentsFn({ data: userId }),
    }),
};
