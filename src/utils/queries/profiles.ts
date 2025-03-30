import {
  fetchProfileFn,
  fetchUserTournamentsFn,
  searchProfilesFn,
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
  search: (query: string, excludeIds?: string[]) =>
    queryOptions({
      queryKey: ["profile", "search", query, excludeIds],
      queryFn: () => searchProfilesFn({ data: { query, excludeIds } }),
      enabled: query.length > 0,
    }),
};
