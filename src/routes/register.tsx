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
import { type SignupSchemaValues, signupSchema } from "@/schema/auth";
import { handleForm } from "@/utils/form";
import { signUpFormOpts } from "@/utils/form-options";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { getSupabaseServerClient } from "@/integrations/supabase/server";
import { signupFn } from "@/utils/user";
import { Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

// export const signupFn = createServerFn()
//   .validator((data: SignupSchemaValues & { redirectUrl?: string }) => data)
//   .handler(async ({ data }) => {
//     const supabase = await getSupabaseServerClient();
//     const { error } = await supabase.auth.signUp({
//       email: data.email,
//       password: data.password,
//       options: {
//         data: {
//           username: data.username,
//         },
//       },
//     });
//     if (error) {
//       return {
//         error: true,
//         message: error.message,
//       };
//     }

//     throw redirect({
//       href: data.redirectUrl || "/",
//     });
//   });

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const signupMutation = useMutation({
    mutationFn: signupFn,
    onSuccess: async (ctx) => {
      if (!ctx?.error) {
        await router.invalidate();

        toast.success("Signup successful! Please login.");
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
    onSubmit: async ({ value }) => {
      await signupMutation.mutateAsync({ data: value });
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
              Sign Up
            </CardTitle>
            <CardDescription className="text-center">
              Sign up for a Bracketopia account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
              <Link to="/login">Already have an account?</Link>
            </Button>
            <form.AppForm>
              <form.SubscribeButton label="Register" />
            </form.AppForm>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
