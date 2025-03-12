import { fetchBracket } from "@/utils/serverFn/brackets";
import { queryOptions } from "@tanstack/react-query";

export const bracketQueryOptions = {
  list: (tournamentId: string) =>
    queryOptions({
      queryKey: ["brackets", tournamentId],
      queryFn: async () => fetchBracket({ data: tournamentId }),
    }),
};
