// TODO: Just follow the guide and do your own form composition you dolt
// https://tanstack.com/form/latest/docs/framework/react/guides/form-composition

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { tournamentCreateSchema } from "@/schema/tournament";
import { getFormDataFromServer, handleForm } from "@/utils/form/form";
import { addTournamentFormOpts } from "@/utils/form/form-options";
import { tournamentQueryOptions } from "@/utils/queries/tournaments";
import { addTournamentFn } from "@/utils/serverFn/tournaments";
import { mergeForm, useForm, useTransform } from "@tanstack/react-form";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed/tournaments_/create/")({
  // beforeLoad: async ({ context }) => {
  //   const { data: tournamentNames } = await fetchTournamentNamesFn();
  //   return {
  //     ...context,
  //     tournamentNames,
  //   };
  // },
  beforeLoad: async ({ context }) => {
    await context.queryClient.ensureQueryData(tournamentQueryOptions.titles());
  },
  loader: async () => ({
    state: await getFormDataFromServer(),
    // titles: await context.queryClient.ensureQueryData(
    //   tournamentQueryOptions.titles(),
    // ),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const {
    state,
    // titles: { data: tournamentNames },
  } = Route.useLoaderData();
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const [maxParticipantValue, setMaxParticipantValue] = useState([8]);
  const { data: tournamentNames } = useSuspenseQuery(
    tournamentQueryOptions.titles(),
  );

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

  // const form = useAppForm({
  const form = useForm({
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
        // onSubmit={(e) => {
        //   e.preventDefault();
        //   e.stopPropagation();
        //   form.handleSubmit();
        // }}
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
            {/* useAppForm */}
            {/* <form.AppField
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
                <field.TextArea label="Description" rows={3} />
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
              validators={{
                onChange: ({ value }) => (!value ? "Required" : undefined),
              }}
              children={(field) => (
                <field.SelectField label="Registration Status">
                  <option value="true">Open</option>
                  <option value="false">Closed</option>
                </field.SelectField>
              )}
            /> */}

            {/* useForm */}
            <form.Field
              name="title"
              validators={{
                onSubmitAsync: async ({ value }) => {
                  const existingTournament = tournamentNames.find(
                    (name) => name.title === value,
                  );
                  return existingTournament
                    ? "Tournament name already exists!"
                    : undefined;
                },
              }}
              children={(field) => (
                <>
                  <Label htmlFor={field.name} className="grid">
                    Tournament Title
                    <Input
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter tournament title"
                      value={field.state.value}
                    />
                  </Label>
                  {field.state.meta.errors ? (
                    <Alert>{field.state.meta.errors.join(", ")}</Alert>
                  ) : null}
                </>
              )}
            />
            <form.Field
              name="description"
              children={(field) => (
                <>
                  <Label htmlFor={field.name} className="grid">
                    Description
                    <Textarea
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter tournament description"
                      rows={3}
                      value={field.state.value}
                    />
                  </Label>
                  {field.state.meta.errors ? (
                    <Alert>{field.state.meta.errors.join(", ")}</Alert>
                  ) : null}
                </>
              )}
            />
            <form.Field
              name="max_participants"
              // validators={{}}
              children={(field) => (
                <>
                  <Label htmlFor={field.name} className="grid">
                    Max Participants: {maxParticipantValue}
                    <Slider
                      id={field.name}
                      max={100}
                      min={2}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onValueChange={setMaxParticipantValue}
                      step={1}
                      value={maxParticipantValue}
                    />
                  </Label>
                  {field.state.meta.errors ? (
                    <Alert>{field.state.meta.errors.join(", ")}</Alert>
                  ) : null}
                </>
              )}
            />

            <form.Field
              name="registration_open"
              children={(field) => (
                <>
                  <RadioGroup
                    defaultValue={field.state.value ? "open" : undefined}
                    className="w-fit"
                  >
                    <div className="flex items-center justify-between gap-2">
                      Open
                      <RadioGroupItem value="open" id="open" />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      Closed
                      <RadioGroupItem value="closed" id="closed" />
                    </div>
                  </RadioGroup>
                  {field.state.meta.errors ? (
                    <Alert>{field.state.meta.errors.join(", ")}</Alert>
                  ) : null}
                </>
                // <field.SelectField label="Registration Status">
                //   <option value="true">Open</option>
                //   <option value="false">Closed</option>
                // </field.SelectField>
              )}
            />
          </CardContent>
          <CardFooter>
            <form.Subscribe>
              <Button>Create Tournament</Button>
            </form.Subscribe>

            {/* <form.AppForm>
              <form.SubscribeButton label="Create Tournament" />
            </form.AppForm> */}
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
