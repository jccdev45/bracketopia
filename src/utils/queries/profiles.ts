import { fetchProfile, fetchUserTournaments } from "@/utils/serverFn/profiles";
import { queryOptions } from "@tanstack/react-query";

export const profileQueryOptions = {
  single: (userId: string) =>
    queryOptions({
      queryKey: ["profile", "single", userId],
      queryFn: () => fetchProfile({ data: userId }),
    }),
  tournaments: (userId: string) =>
    queryOptions({
      queryKey: ["profile", "tournaments", userId],
      queryFn: () => fetchUserTournaments({ data: userId }),
    }),
};
