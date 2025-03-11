import { TournamentBrackets } from "@/components/tournament/tournament-brackets";
import { TournamentHeader } from "@/components/tournament/tournament-header";
import { TournamentModerators } from "@/components/tournament/tournament-moderators";
import { TournamentParticipants } from "@/components/tournament/tournament-participants";
import { fetchTournament } from "@/utils/tournaments";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/tournaments/$id")({
  component: RouteComponent,
  loader: ({ params: { id } }) => fetchTournament({ data: id }),
});

function RouteComponent() {
  const tournament = Route.useLoaderData();

  return (
    <div className="p-6">
      <TournamentHeader tournament={tournament} />
      <TournamentParticipants
        participants={tournament.tournament_participants}
      />
      <TournamentBrackets brackets={tournament.tournament_brackets} />
      <TournamentModerators moderators={tournament.tournament_moderators} />
    </div>
  );
}
