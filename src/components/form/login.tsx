import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useAppForm } from "@/hooks/use-app-form";
import { loginSchema } from "@/schema/auth";
import { loginFormOpts } from "@/utils/form/form-options";
import { emailPasswordLoginFn } from "@/utils/serverFn/auth";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { toast } from "sonner";

export function Login() {
  return (
    <main className="flex flex-1 flex-col items-center pt-8 sm:p-8">
      <div className="relative w-full max-w-6xl p-4 sm:p-8">
        <div className="-z-10 absolute inset-0 overflow-hidden sm:rounded-lg">
          <div className="absolute inset-0 backdrop-blur-[2px]" />
          <Image
            src="https://images.unsplash.com/photo-1558008258-3256797b43f3?q=80&w=3131&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Photo by Stem List on Unsplash"
            layout="fullWidth"
            className="hidden sm:block"
          />
        </div>
        <div className="relative mx-auto flex w-full max-w-md flex-col items-center justify-center rounded-lg bg-muted p-6 shadow-lg">
          <h1 className="mb-4 text-balance text-center font-body font-bold text-3xl sm:text-3xl">
            Login
          </h1>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}

function LoginForm() {
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: emailPasswordLoginFn,
    onSuccess: async (ctx) => {
      if (!ctx?.error) {
        toast.success("Welcome back!");
        await router.invalidate();
        // router.navigate({ to: "/" });
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
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
  );
}
