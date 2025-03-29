import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppForm } from "@/hooks/use-app-form";
import { tournamentCreateSchema } from "@/schema/tournament";
import { addTournamentFormOpts } from "@/utils/form/form-options";
import { tournamentQueryOptions } from "@/utils/queries/tournaments";
import { addTournamentFn } from "@/utils/serverFn/tournaments";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed/tournaments_/create/")({
  beforeLoad: async ({ context }) => {
    await context.queryClient.ensureQueryData(tournamentQueryOptions.form());
  },
  component: TournamentCreate,
});

function TournamentCreate() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const { data: tournaments } = useSuspenseQuery(tournamentQueryOptions.form());

  const createTournamentMutation = useMutation({
    mutationFn: addTournamentFn,
    onSuccess: ({ id }) => {
      toast.success("Tournament created successfully!");
      navigate({
        to: "/tournaments/$id",
        params: { id },
      });
    },
    onError: (error) => {
      toast.error(`Failed to create tournament: ${error.message}`);
    },
  });

  const form = useAppForm({
    ...addTournamentFormOpts,
    validators: {
      onSubmitAsync: async ({ value }) => {
        // Check for duplicate name
        const existingTournament = tournaments.find(
          (name) => name.title === value.title,
        );
        if (existingTournament) {
          return {
            fields: {
              title: "Tournament name already exists!",
            },
          };
        }
        return null;
      },
      onBlur: tournamentCreateSchema,
    },
    onSubmit: async ({ value }) => {
      await createTournamentMutation.mutateAsync({
        data: {
          ...value,
          creator_id: user?.id as string,
        },
      });
    },
  });

  return (
    <div className="container mx-auto py-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Card className="mx-auto w-full max-w-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="font-bold text-2xl">
              Create New Tournament
            </CardTitle>
            <CardDescription>
              Set up your tournament details and structure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form.AppField
              name="title"
              children={(field) => (
                <field.TextField
                  label="Tournament Title"
                  placeholder="Enter tournament title"
                />
              )}
            />
            <form.AppField
              name="description"
              children={(field) => (
                <field.TextArea
                  label="Description"
                  placeholder="Enter tournament description"
                  rows={3}
                />
              )}
            />

            <form.AppField
              name="category"
              children={(field) => <field.CategoryField label="Category" />}
            />

            <form.AppField
              name="max_participants"
              children={(field) => (
                <field.SliderField label="Max Participants" min={2} max={100} />
              )}
            />

            <form.AppField
              name="registration_open"
              children={(field) => (
                <field.SwitchField label="Registration Status" />
              )}
            />
          </CardContent>
          <CardFooter>
            <form.AppForm>
              <form.SubscribeButton label="Create Tournament" />
            </form.AppForm>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
