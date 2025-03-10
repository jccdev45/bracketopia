import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppForm } from "@/hooks/use-app-form";
import { loginSchema } from "@/schema/auth";
import { getFormDataFromServer, handleForm } from "@/utils/form";
import { loginFormOpts } from "@/utils/form-options";
import { loginFn } from "@/utils/user";
import { mergeForm, useTransform } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
  loader: async () => ({
    state: await getFormDataFromServer(),
  }),
});

function RouteComponent() {
  const { state } = Route.useLoaderData();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: loginFn,
    onSuccess: async (ctx) => {
      if (!ctx?.error) {
        await router.invalidate();
        router.navigate({ to: "/" });
        return;
      }
    },
    onError: (error) => {
      toast.error(`There was an error: ${error.message}`);
    },
  });

  const form = useAppForm({
    ...loginFormOpts,
    validators: {
      onBlur: loginSchema,
    },
    transform: useTransform((baseForm) => mergeForm(baseForm, state), [state]),
    onSubmit: async ({ formApi, value }) => {
      await loginMutation.mutateAsync({ data: value });

      toast.success("Welcome back!");
      formApi.reset();
    },
  });

  return (
    <div className="flex items-center justify-center">
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
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Login
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials or login with a provider
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form.AppField
              name="email"
              children={(field) => {
                return (
                  <field.TextField
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                  />
                );
              }}
            />
            <form.AppField
              name="password"
              children={(field) => {
                return (
                  <field.TextField
                    label="Password"
                    type="password"
                    placeholder="******"
                  />
                );
              }}
            />
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="ghost" asChild>
              <Link to="/register">Don't have an account?</Link>
            </Button>
            <form.AppForm>
              <form.SubscribeButton label="Login" />
            </form.AppForm>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
