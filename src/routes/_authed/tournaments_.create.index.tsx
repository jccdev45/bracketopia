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
import { addMinutes } from "date-fns";
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
        const errors: { fields: Record<string, string> } = { fields: {} };

        // Check for duplicate name
        const existingTournament = tournaments.find(
          (name) => name.title === value.title,
        );
        if (existingTournament) {
          errors.fields.title = "Tournament name already exists!";
        }

        // Date validations
        if (value.start_date || value.end_date) {
          const now = new Date();

          if (value.start_date) {
            const start = new Date(value.start_date);
            if (start < addMinutes(now, 30)) {
              errors.fields.start_date =
                "Start date must be at least 30 minutes in the future";
            }
          }

          if (value.end_date && !value.start_date) {
            errors.fields.start_date =
              "Start date is required when end date is set";
          }

          if (value.start_date && value.end_date) {
            const start = new Date(value.start_date);
            const end = new Date(value.end_date);

            if (end <= start) {
              errors.fields.end_date = "End date must be after start date";
            }

            // Ensure tournament is at least 30 minutes long
            if (end.getTime() - start.getTime() < 30 * 60 * 1000) {
              errors.fields.end_date =
                "Tournament must be at least 30 minutes long";
            }
          }
        }

        return Object.keys(errors.fields).length > 0 ? errors : null;
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

  // Get current date for min attribute
  const minDate = addMinutes(new Date(), 30).toISOString().slice(0, 16);

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
          <CardContent className="space-y-6">
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <form.AppField
                name="format"
                children={(field) => (
                  <field.SelectField
                    label="Tournament Format"
                    placeholder="Select a format"
                    values={[
                      {
                        value: "single_elimination",
                        label: "Single Elimination",
                      },
                      {
                        value: "double_elimination",
                        label: "Double Elimination",
                      },
                      { value: "round_robin", label: "Round Robin" },
                    ]}
                  />
                )}
              />

              <form.AppField
                name="scoring_type"
                children={(field) => (
                  <field.SelectField
                    label="Scoring Type"
                    placeholder="Select scoring type"
                    values={[
                      { value: "single", label: "Single Match" },
                      { value: "best_of", label: "Best of N" },
                    ]}
                  />
                )}
              />
            </div>

            {form.getFieldValue("scoring_type") === "best_of" && (
              <form.AppField
                name="best_of"
                children={(field) => (
                  <field.SelectField
                    label="Best of"
                    placeholder="Select match length"
                    values={[
                      { value: "3", label: "Best of 3" },
                      { value: "5", label: "Best of 5" },
                      { value: "7", label: "Best of 7" },
                    ]}
                  />
                )}
              />
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <form.AppField
                name="start_date"
                children={(field) => (
                  <field.TextField
                    type="datetime-local"
                    label="Start Date"
                    min={minDate}
                  />
                )}
              />

              <form.Subscribe selector={(state) => state.values.start_date}>
                {(startDate) => (
                  <form.AppField
                    name="end_date"
                    children={(field) => (
                      <field.TextField
                        type="datetime-local"
                        label="End Date"
                        min={startDate || minDate}
                      />
                    )}
                  />
                )}
              </form.Subscribe>
            </div>

            <form.AppField
              name="join_type"
              children={(field) => (
                <field.SelectField
                  label="Join Requirements"
                  placeholder="Select join type"
                  values={[
                    { value: "open", label: "Open Registration" },
                    { value: "approval", label: "Approval Required" },
                    { value: "invite", label: "Invite Only" },
                  ]}
                />
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <form.AppField
                name="max_participants"
                children={(field) => (
                  <field.SliderField
                    label="Max Participants"
                    min={2}
                    max={100}
                  />
                )}
              />

              <form.AppField
                name="registration_open"
                children={(field) => (
                  <field.SwitchField label="Registration Status" />
                )}
              />
            </div>
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
