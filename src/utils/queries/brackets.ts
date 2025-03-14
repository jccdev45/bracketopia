import { fetchBracketFn, generateBracketFn } from "@/utils/serverFn/brackets";
import { updateMatchResultFn } from "@/utils/serverFn/matches";
import { queryOptions } from "@tanstack/react-query";

export const bracketQueryOptions = {
  list: (tournamentId: string) =>
    queryOptions({
      queryKey: ["brackets", tournamentId],
      queryFn: async () => fetchBracketFn({ data: { tournamentId } }),
    }),
};

export const bracketMutationOptions = {
  generate: () => ({
    mutationKey: ["brackets", "generate"],
    mutationFn: generateBracketFn,
  }),
  updateMatch: () => ({
    mutationKey: ["matches", "update"],
    mutationFn: updateMatchResultFn,
  }),
};
