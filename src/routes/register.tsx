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
import { signupSchema } from "@/schema/auth";
import { signUpFormOpts } from "@/utils/form-options";
import { signupFn } from "@/utils/user";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();

  const signupMutation = useMutation({
    mutationFn: signupFn,
    onSuccess: async (ctx) => {
      if (!ctx?.error) {
        toast.success("Signup successful!");
        await router.invalidate();
        router.navigate({ to: "/" });
      } else {
        toast.error(ctx?.message || "Signup failed.");
      }
    },
    onError: (error) => {
      toast.error(`Network error: ${error.message}`);
    },
  });

  const form = useAppForm({
    ...signUpFormOpts,
    validators: { onBlur: signupSchema },
    onSubmit: async ({ formApi, value }) => {
      await signupMutation.mutateAsync({ data: value });

      formApi.reset();
    },
  });

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Sign Up
            </CardTitle>
            <CardDescription className="text-center">
              Sign up for a Bracketopia account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
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
              name="username"
              children={(field) => {
                return (
                  <field.TextField label="Username" placeholder="coolguy123" />
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
          <CardFooter className="flex-col">
            <div className="flex items-center justify-between">
              <Button variant="ghost" asChild>
                <Link to="/login">Already have an account?</Link>
              </Button>
              <form.AppForm>
                <form.SubscribeButton label="Register" />
              </form.AppForm>
            </div>
            <div className="block text-balance text-center">
              {signupMutation.data ? (
                <div className="text-red-400">
                  {signupMutation.data.message}
                </div>
              ) : null}
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
