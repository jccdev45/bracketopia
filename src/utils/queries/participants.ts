import { fetchParticipantsWithProfiles } from "@/utils/serverFn/participants";
import { queryOptions } from "@tanstack/react-query";

export const participantsQueryOptions = {
  list: (tournamentId: string) =>
    queryOptions({
      queryKey: ["participants", tournamentId],
      queryFn: async () =>
        fetchParticipantsWithProfiles({ data: tournamentId }),
    }),
};
