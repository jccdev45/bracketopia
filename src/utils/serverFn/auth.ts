import { createClient } from "@/integrations/supabase/server";
import type {
  AuthResponse,
  AuthSessionData,
  AuthUserData,
  LoginSchemaValues,
  Provider,
  Resend,
  SignupSchemaValues,
  UserAuthUpdate,
  VerifyOtp,
} from "@/types/auth.types";
import type { User } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";

// Helper function to extract user data
const extractUserData = (user: User): AuthUserData => ({
  id: user.id,
  email: user.email,
  user_metadata: user.user_metadata,
  app_metadata: user.app_metadata,
  aud: user.aud,
  created_at: user.created_at,
  updated_at: user.updated_at,
  phone: user.phone,
  confirmed_at: user.confirmed_at,
  email_confirmed_at: user.email_confirmed_at,
  phone_confirmed_at: user.phone_confirmed_at,
  last_sign_in_at: user.last_sign_in_at,
  role: user.role,
});

/**
 * Fetches the current user's data from Supabase auth
 * @returns The user data if authenticated, null otherwise
 */
export const fetchUserFn = createServerFn({ method: "GET" })
  .validator(() => null)
  .handler(async (): Promise<AuthResponse<AuthUserData | null>> => {
    const supabase = createClient();
    const {
      data: { user },
      error: _error,
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        error: false,
        message: "No user found",
        data: null,
      };
    }

    return {
      error: false,
      message: "User found",
      data: extractUserData(user),
    };
  });

/**
 * Authenticates a user with email and password
 * @param data - Login credentials
 * @returns Success/error status with session data
 */
export const emailPasswordLoginFn = createServerFn()
  .validator((d: LoginSchemaValues) => d)
  .handler(async ({ data }): Promise<AuthResponse<AuthSessionData>> => {
    const supabase = createClient();
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error || !authData.session || !authData.user) {
      return {
        error: true,
        message: error?.message ?? "Failed to sign in",
      };
    }

    return {
      error: false,
      message: "Successfully signed in",
      data: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_in: authData.session.expires_in,
        expires_at: authData.session.expires_at,
        token_type: authData.session.token_type,
        user: extractUserData(authData.user),
      },
    };
  });

/**
 * Creates a new user account
 * @param data - Signup information
 * @returns Success/error status with user data
 */
export const signupFn = createServerFn()
  .validator((d: SignupSchemaValues) => d)
  .handler(async ({ data }): Promise<AuthResponse<AuthUserData>> => {
    const supabase = createClient();
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
        },
      },
    });

    if (error || !authData.user) {
      return {
        error: true,
        message: error?.message ?? "Failed to sign up",
      };
    }

    return {
      error: false,
      message: "Successfully signed up",
      data: extractUserData(authData.user),
    };
  });

/**
 * Sends a magic link for passwordless login
 * @param data - Email and optional redirect URL
 * @returns Success/error status
 */
export const magicLinkLoginFn = createServerFn()
  .validator((d: { email: string; redirectUrl?: string }) => d)
  .handler(async ({ data }): Promise<AuthResponse> => {
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
      message: "Magic link sent successfully",
    };
  });

/**
 * Verifies a one-time password (OTP)
 * @param data - OTP verification data
 * @returns Success/error status with session data
 */
export const verifyOtpFn = createServerFn()
  .validator((d: VerifyOtp) => d)
  .handler(async ({ data }): Promise<AuthResponse<AuthSessionData>> => {
    const supabase = createClient();
    const { data: authData, error } = await supabase.auth.verifyOtp({
      token: data.token,
      email: data.email,
      type: data.type,
    });

    if (error || !authData.session || !authData.user) {
      return {
        error: true,
        message: error?.message ?? "Failed to verify OTP",
      };
    }

    return {
      error: false,
      message: "Successfully verified OTP",
      data: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_in: authData.session.expires_in,
        expires_at: authData.session.expires_at,
        token_type: authData.session.token_type,
        user: extractUserData(authData.user),
      },
    };
  });

/**
 * Authenticates a user with a third-party provider
 * @param data - Provider and token information
 * @returns Success/error status with session data
 */
export const providerLoginFn = createServerFn()
  .validator((d: { provider: Provider; token: string }) => d)
  .handler(async ({ data }): Promise<AuthResponse<AuthSessionData>> => {
    const supabase = createClient();
    const { data: authData, error } = await supabase.auth.signInWithIdToken({
      provider: data.provider,
      token: data.token,
    });

    if (error || !authData.session || !authData.user) {
      return {
        error: true,
        message: error?.message ?? "Failed to authenticate with provider",
      };
    }

    return {
      error: false,
      message: "Successfully authenticated with provider",
      data: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_in: authData.session.expires_in,
        expires_at: authData.session.expires_at,
        token_type: authData.session.token_type,
        user: extractUserData(authData.user),
      },
    };
  });

/**
 * Updates user authentication data
 * @param data - User data to update
 * @returns Success/error status with updated user data
 */
export const updateUserFn = createServerFn()
  .validator((d: UserAuthUpdate) => d)
  .handler(async ({ data }): Promise<AuthResponse<AuthUserData>> => {
    const supabase = createClient();
    const { data: userData, error } = await supabase.auth.updateUser(data);

    if (error || !userData.user) {
      return {
        error: true,
        message: error?.message ?? "Failed to update user",
      };
    }

    return {
      error: false,
      message: "Successfully updated user",
      data: extractUserData(userData.user),
    };
  });

/**
 * Resends verification email
 * @param data - Email and verification type
 * @returns Success/error status
 */
export const resendFn = createServerFn()
  .validator((d: Resend) => d)
  .handler(async ({ data }): Promise<AuthResponse> => {
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
      message: "We've resent you a verification email.",
    };
  });
