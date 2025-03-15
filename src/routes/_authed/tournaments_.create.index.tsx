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
import { addTournamentFormOpts } from "@/utils/form/form-options";
import { tournamentQueryOptions } from "@/utils/queries/tournaments";
import { addTournamentFn } from "@/utils/serverFn/tournaments";
import { useForm } from "@tanstack/react-form";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed/tournaments_/create/")({
  beforeLoad: async ({ context }) => {
    await context.queryClient.ensureQueryData(tournamentQueryOptions.titles());
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const [maxParticipantValue, setMaxParticipantValue] = useState([8]); // Correct initial value
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

  const form = useForm({
    ...addTournamentFormOpts,
    // Server-side validation and Zod schema validation
    validators: {
      onSubmitAsync: async ({ value }) => {
        //First, zod validation
        const result = tournamentCreateSchema.safeParse(value);
        if (!result.success) {
          const errors: { fields: Record<string, string> } = {
            fields: {},
          };
          for (const issue of result.error.issues) {
            errors.fields[issue.path.join(".")] = issue.message;
          }

          return errors;
        }
        // Server-side validation (check for duplicate name)
        const existingTournament = tournamentNames.find(
          (name) => name.title === value.title,
        );
        if (existingTournament) {
          return {
            fields: {
              title: "Tournament name already exists!", // Set the error *message* directly
            },
          };
        }
        //If no errors during async validation, the form is valid
        return null;
      },
    },
    onSubmit: async ({ value }) => {
      // onSubmit is only run if validation is OK
      await createTournamentMutation.mutateAsync({
        data: {
          ...value,
          max_participants: maxParticipantValue[0], // Use the slider value
          creator_id: user?.id as string,
          registration_open: value.registration_open,
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
            <form.Field
              name="title"
              children={(field) => (
                <>
                  <Label htmlFor={field.name} className="grid">
                    Tournament Title
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter tournament title"
                    value={field.state.value}
                  />

                  {field.state.meta.errors?.length ? (
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
                  </Label>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter tournament description"
                    rows={3}
                    value={field.state.value}
                  />
                  {field.state.meta.errors?.length ? (
                    <Alert>{field.state.meta.errors.join(", ")}</Alert>
                  ) : null}
                </>
              )}
            />
            <form.Field
              name="max_participants" // This field is just for visual representation
              children={(field) => (
                <>
                  <Label htmlFor={field.name} className="grid">
                    Max Participants: {maxParticipantValue}
                  </Label>
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
                  {field.state.meta.errors?.length ? (
                    <Alert>{field.state.meta.errors.join(", ")}</Alert>
                  ) : null}
                </>
              )}
            />

            <form.Field
              name="registration_open"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>Registration Status</Label>
                  <RadioGroup
                    defaultValue={field.state.value ? "open" : "closed"}
                    className="w-fit"
                    name={field.name}
                    onValueChange={(value) =>
                      field.handleChange(value === "open")
                    }
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
                  {field.state.meta.errors?.length ? (
                    <Alert>{field.state.meta.errors.join(", ")}</Alert>
                  ) : null}
                </>
              )}
            />
          </CardContent>
          <CardFooter>
            <form.Subscribe>
              {(state) => (
                <Button disabled={state.isSubmitting} type="submit">
                  Create Tournament
                </Button>
              )}
            </form.Subscribe>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
