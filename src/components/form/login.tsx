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
import { loginFormOpts } from "@/utils/form/form-options";
import { emailPasswordLoginFn } from "@/utils/serverFn/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

export function Login() {
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: emailPasswordLoginFn,
    onSuccess: async (ctx) => {
      if (!ctx?.error) {
        toast.success("Welcome back!");
        await router.invalidate();
        router.navigate({ to: "/" });
      } else {
        toast.error(ctx?.message || "Login failed");
      }
    },
    onError: (error) => {
      toast.error(`Network error: ${error.message}`);
    },
  });

  const form = useAppForm({
    ...loginFormOpts,
    validators: {
      onBlur: loginSchema,
    },
    onSubmit: async ({ formApi, value }) => {
      await loginMutation.mutateAsync({ data: value });

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
            <CardTitle className="text-center font-bold text-2xl">
              Login
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials or login with a provider
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
                <Link to="/register">Don't have an account?</Link>
              </Button>
              <form.AppForm>
                <form.SubscribeButton label="Login" />
              </form.AppForm>
            </div>
            <div className="block text-balance text-center">
              {loginMutation.data ? (
                <div className="text-red-400">{loginMutation.data.message}</div>
              ) : null}
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
