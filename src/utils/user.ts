import { getSupabaseServerClient } from "@/integrations/supabase/server";
import type { LoginSchemaValues, SignupSchemaValues } from "@/schema/auth";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await getSupabaseServerClient();
  const { data, error: _error } = await supabase.auth.getUser();

  if (!data.user?.email) {
    return null;
  }

  return data.user;
});

export const loginFn = createServerFn()
  .validator((data: LoginSchemaValues) => data)
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return {
        error: true,
        message: error.message,
      };
    }
  });

export const signupFn = createServerFn()
  .validator((data: SignupSchemaValues & { redirectUrl?: string }) => data)
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
        },
      },
    });
    if (error) {
      return {
        error: true,
        message: error.message,
      };
    }

    throw redirect({
      href: data.redirectUrl || "/",
    });
  });
