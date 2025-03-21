import { createClient } from "@/integrations/supabase/server";
import type {
  AuthError,
  LoginSchemaValues,
  NarrowedSession,
  NarrowedUser,
  Provider,
  ProviderLoginReturn,
  Resend,
  ResendReturn,
  SignupSchemaValues,
  UserAuthUpdate,
  UserUpdateSuccess,
  VerifyOtp,
  VerifyOtpReturn,
} from "@/types/auth.types";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

interface UserData {
  id: string;
  email?: string;
  user_metadata: { [key: string]: object };
  app_metadata: { [key: string]: object };
}

export const fetchUserFn = createServerFn({ method: "GET" })
  .validator((d: unknown) => d)
  .handler(async () => {
    const supabase = createClient();
    const {
      data: { user },
      error: _error,
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { id, email, user_metadata, app_metadata } = user;
    return {
      id,
      email,
      user_metadata,
      app_metadata,
    } as UserData;
  });

export const emailPasswordLoginFn = createServerFn()
  .validator((d: LoginSchemaValues) => d)
  .handler(async ({ data }) => {
    const supabase = createClient();
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
    return {
      error: false,
      message: "Successfully signed in",
    };
  });

export const signupFn = createServerFn()
  .validator((d: SignupSchemaValues & { redirectUrl?: string }) => d)
  .handler(async ({ data }) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
        },
        emailRedirectTo: data.redirectUrl ?? undefined,
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

export const magicLinkLoginFn = createServerFn()
  .validator((d: { email: string; redirectUrl?: string }) => d)
  .handler(async ({ data }) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: data.email,
      options: {
        emailRedirectTo: data.redirectUrl ?? undefined,
      },
    });

    if (error) {
      return {
        error: true,
        message: error.message,
      };
    }

    return {
      error: false,
      message: "Check your email for a magic link to sign in.",
    };
  });

export const verifyOtpFn = createServerFn()
  .validator((d: VerifyOtp) => d)
  .handler(async ({ data }): Promise<VerifyOtpReturn> => {
    const supabase = createClient();
    const { data: userData, error } = await supabase.auth.verifyOtp({
      token: data.token,
      email: data.email,
      type: data.type,
    });

    if (error) {
      return {
        error: true,
        message: error.message,
      };
    }
    return {
      error: false,
      data: {
        user: userData.user as NarrowedUser,
        session: userData.session as NarrowedSession,
      },
    };
  });

export const providerLoginFn = createServerFn()
  .validator((d: { provider: Provider; token: string }) => d)
  .handler(async ({ data: { provider, token } }) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider,
      token,
    });

    if (error) {
      return {
        error: true,
        message: error.message,
      };
    }

    const narrowedSession: NarrowedSession | null = data.session
      ? {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_in: data.session.expires_in,
          expires_at: data.session.expires_at,
          token_type: data.session.token_type,
          user: data.session.user as NarrowedUser,
        }
      : null;

    return {
      error: false,
      data: {
        user: data.user as NarrowedUser,
        session: narrowedSession,
      },
    } as ProviderLoginReturn;
  });

export const updateUserFn = createServerFn()
  .validator((d: UserAuthUpdate) => d)
  .handler(async ({ data }) => {
    const supabase = createClient();
    const { data: userData, error } = await supabase.auth.updateUser({
      email: data.email ?? undefined,
      password: data.password ?? undefined,
      data: {
        username: data.username ?? undefined,
        avatar_url: data.avatar_url ?? undefined,
      },
    });

    if (error) {
      return {
        error: true,
        message: error.message,
      } as AuthError;
    }

    return {
      error: false,
      data: {
        user: userData?.user as NarrowedUser,
        id: userData?.user.id,
      },
    } as UserUpdateSuccess;
  });

export const resendFn = createServerFn()
  .validator((d: Resend) => d)
  .handler(async ({ data }): Promise<ResendReturn> => {
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: data.type,
      email: data.email,
      options: {
        emailRedirectTo: data.redirectUrl ?? undefined,
      },
    });

    if (error) {
      return {
        error: true,
        message: error.message,
      };
    }

    return {
      error: false,
      message: `We've resent you a verification email.`,
    };
  });
