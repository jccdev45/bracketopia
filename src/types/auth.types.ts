import type { Session, User } from "@supabase/supabase-js";

// Narrowed types for User and Session (to avoid non-serializable properties)
export type NarrowedUser = Pick<
  User,
  | "id"
  | "aud"
  | "email"
  | "phone"
  | "app_metadata"
  | "user_metadata"
  | "created_at"
  | "updated_at"
>;

export type NarrowedSession = Pick<
  Session,
  "access_token" | "refresh_token" | "expires_in" | "expires_at" | "token_type"
> & { user: NarrowedUser };

// Types for authentication functions
export type Provider = "google" | "apple" | "facebook";

export type LoginSchemaValues = {
  email: string;
  password: string;
};

export type SignupSchemaValues = {
  email: string;
  password: string;
  username: string;
};

export type UserAuthUpdate = {
  email?: string;
  password?: string;
  username?: string;
  avatar_url?: string;
};

export type VerifyOtp = {
  email: string;
  token: string;
  type: "email" | "recovery" | "invite" | "email_change";
};

export type Resend = {
  type: "signup" | "email_change";
  email: string;
  redirectUrl?: string;
};

// Success and error types for various functions

export type AuthSuccess<T> = {
  error: false;
  message?: string;
  data?: T; // Generic type parameter
};

export type AuthError = {
  error: true;
  message: string;
};

export type ProviderLoginSuccess = AuthSuccess<{
  user: NarrowedUser;
  session: NarrowedSession | null;
}>;

export type ProviderLoginReturn = ProviderLoginSuccess | AuthError;
export type UserUpdateSuccess = AuthSuccess<{ user: NarrowedUser }>;
export type UserUpdateReturn = UserUpdateSuccess | AuthError;
export type VerifyOtpReturn =
  | AuthSuccess<{ user: NarrowedUser; session: NarrowedSession | null }>
  | AuthError;

export type ResendReturn =
  | AuthSuccess<{
      type: "signup" | "email_change";
      email: string;
      redirectUrl?: string | undefined;
    }>
  | AuthError;
