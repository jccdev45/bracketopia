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
import { queryOptions } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

/**
 * Query options for authentication-related functions.  Provides pre-configured options for useQuery hooks.
 */
export const authQueryOptions = {
  /**
   * Query options for logging in a user with email and password.
   * @param data - Login credentials.
   * @returns Query options for email/password login.
   */
  login: (data: LoginSchemaValues) =>
    queryOptions({
      queryKey: ["auth", "login"],
      queryFn: async () => emailPasswordLoginFn({ data }),
    }),
  /**
   * Query options for signing up a new user.
   * @param data - User signup data (email, password, username).
   * @returns Query options for user signup.
   */
  signUp: (data: SignupSchemaValues) =>
    queryOptions({
      queryKey: ["auth", "signUp"],
      queryFn: async () => signupFn({ data }),
    }),
  /**
   * Query options for sending a magic link login email.
   * @param data - Email address and optional redirect URL.
   * @returns Query options for sending a magic link.
   */
  magicLink: (data: { email: string; redirectUrl?: string }) =>
    queryOptions({
      queryKey: ["auth", "magicLink"],
      queryFn: async () => magicLinkLoginFn({ data }),
    }),
  /**
   * Query options for verifying an OTP (One-Time Password).
   * @param data - Email, OTP token, and verification type.
   * @returns Query options for OTP verification.
   */
  verifyOtp: (data: VerifyOtp) =>
    queryOptions({
      queryKey: ["auth", "verify"],
      queryFn: async () => verifyOtpFn({ data }),
    }),
  /**
   * Query options for logging in with a third-party provider.
   * @param data - Provider name and provider token.
   * @returns Query options for provider login.
   */
  providerLogin: (data: { provider: Provider; token: string }) =>
    queryOptions({
      queryKey: ["auth", "providerLogin"],
      queryFn: async () => providerLoginFn({ data }),
    }),
  /**
   * Query options for updating user information.
   * @param data - User data to update.
   * @returns Query options for updating user profile.
   */
  updateUser: (data: UserAuthUpdate) =>
    queryOptions({
      queryKey: ["auth", "update"],
      queryFn: async () => updateUserFn({ data }),
    }),
  /**
   * Query options for resending a signup confirmation email or an email change confirmation email.
   * @param data - Type of email to resend, the email address, and optional redirect URL.
   * @returns Query options for resending a confirmation email.
   */
  resend: (data: Resend) =>
    queryOptions({
      queryKey: ["auth", "resend"],
      queryFn: async () => resendFn({ data }),
    }),
};

/**
 * Server function to log in an existing user with email and password.
 * @returns An object indicating success or failure, including a message.
 */
export const emailPasswordLoginFn = createServerFn()
  .validator((d: LoginSchemaValues) => d)
  .handler(async ({ data }) => {
    const supabase = await createClient();
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

/**
 * Server function to sign up a new user.
 * @param data - Signup data including email, password, username, and optional redirect URL.
 * @throws {redirect} Redirects to the provided redirect URL on successful signup.
 */
export const signupFn = createServerFn()
  .validator((d: SignupSchemaValues & { redirectUrl?: string }) => d)
  .handler(async ({ data }) => {
    const supabase = await createClient();
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

/**
 * Server function to send a magic link (OTP) to the user's email for login.
 * @param data - Email address and optional redirect URL.
 * @returns An object indicating success or failure, including a message.
 */
export const magicLinkLoginFn = createServerFn()
  .validator((d: { email: string; redirectUrl?: string }) => d)
  .handler(async ({ data }) => {
    const supabase = await createClient();
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

/**
 * Server function to verify a user-supplied OTP (One-Time Password) or TokenHash.
 * @param data - Email address, OTP token, and verification type.
 * @returns An object containing user and session data or an error object.
 */
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

/**
 * Server function to log in a user with a specific provider (e.g., Google, Apple, Facebook).
 * @param data - Provider name and provider-issued token.
 * @returns An object containing user and session data or an error object.
 */
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

    // Narrow the session
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

/**
 * Server function to update an existing user's profile information.
 * @param data - User data to update (email, password, username, avatar_url).
 * @returns An object containing the updated user data or an error object.
 */
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
      },
    } as UserUpdateSuccess;
  });

/**
 * Server function to resend a signup confirmation email or an email change confirmation email.
 * @param data - Resend data (email address, type of email to resend, and optional redirect URL).
 * @returns An object indicating success or failure, including a message.
 */
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
