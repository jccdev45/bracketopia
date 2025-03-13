import { fetchModeratorsWithProfilesFn } from "@/utils/serverFn/moderators";
import { queryOptions } from "@tanstack/react-query";

export const moderatorQueryOptions = {
  list: (tournamentId: string) =>
    queryOptions({
      queryKey: ["tournament-moderators", tournamentId],
      queryFn: () =>
        fetchModeratorsWithProfilesFn({
          data: tournamentId,
        }),
    }),
};
