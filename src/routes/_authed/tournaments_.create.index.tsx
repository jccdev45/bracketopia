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
import { getFormDataFromServer, handleForm } from "@/utils/form";
import { addTournamentFormOpts } from "@/utils/form-options";
import { addTournament } from "@/utils/tournaments";
import { mergeForm, useTransform } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed/tournaments_/create/")({
  component: RouteComponent,
  loader: async () => ({
    state: await getFormDataFromServer(),
  }),
});

function RouteComponent() {
  const { state } = Route.useLoaderData();
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();

  const createTournamentMutation = useMutation({
    mutationFn: addTournament,
    onSuccess: ({ id }) => {
      toast.success("Tournament created successfully!");
      navigate({ 
        to: "/tournaments/$id", 
        params: { id }
      });
    },
    onError: (error) => {
      toast.error(`Failed to create tournament: ${error.message}`);
    },
  });

  const form = useAppForm({
    ...addTournamentFormOpts,
    validators: {
      onBlur: tournamentCreateSchema,
    },
    transform: useTransform((baseForm) => mergeForm(baseForm, state), [state]),
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
        action={handleForm.url}
        method="POST"
        encType="multipart/form-data"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
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
                  type="text"
                />
              )}
            />
            <form.AppField
              name="description"
              children={(field) => (
                <field.TextArea
                  label="Description"
                  rows={3}
                />
              )}
            />
            <form.AppField
              name="max_participants"
              children={(field) => (
                <field.TextField
                  label="Maximum Participants"
                  type="number"
                  min={2}
                  max={100}
                  step={1}
                />
              )}
            />
            <form.AppField
              name="registration_open"
              children={(field) => (
                <field.SelectField label="Registration Status">
                  <option value="true">Open</option>
                  <option value="false">Closed</option>
                </field.SelectField>
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
