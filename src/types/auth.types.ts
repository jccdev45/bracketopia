import type { Session, User } from "@supabase/supabase-js";

// Narrowed types for User and Session (to avoid non-serializable properties)
export type NarrowedUser = Pick<
  User,
  | "user_metadata"
  | "app_metadata"
  | "created_at"
  | "updated_at"
  | "phone"
  | "email"
  | "aud"
  | "id"
>;

export type NarrowedSession = Pick<
  Session,
  "access_token" | "refresh_token" | "expires_in" | "expires_at" | "token_type"
> & { user: NarrowedUser };

// Types for authentication functions
export type Provider = "google" | "apple" | "facebook";

export type LoginSchemaValues = {
  password: string;
  email: string;
};

export type SignupSchemaValues = {
  password: string;
  username: string;
  email: string;
};

export type UserAuthUpdate = {
  avatar_url?: string;
  password?: string;
  username?: string;
  email?: string;
};

export type VerifyOtp = {
  type: "email" | "recovery" | "invite" | "email_change";
  email: string;
  token: string;
};

export type Resend = {
  type: "signup" | "email_change";
  redirectUrl?: string;
  email: string;
};

// Success and error types for various functions

export type AuthSuccess<T> = {
  message?: string;
  error: false;
  data?: T;
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
