import type { User } from "@supabase/supabase-js";

/**
 * Schema types for form validation
 */
export type LoginSchemaValues = {
  email: string;
  password: string;
};

export type SignupSchemaValues = {
  email: string;
  password: string;
  username: string;
};

/**
 * Base response type for all auth functions
 */
export type AuthResponse<T = undefined> = {
  error: boolean;
  message: string;
  data?: T;
};

/**
 * User metadata types
 */
export type UserMetadata = {
  username?: string;
  [key: string]: string | number | boolean | null | undefined;
};

export type AppMetadata = {
  provider?: string;
  [key: string]: string | number | boolean | null | undefined;
};

/**
 * User data returned from auth functions
 */
export type AuthUserData = Pick<
  User,
  | "id"
  | "email"
  | "user_metadata"
  | "app_metadata"
  | "aud"
  | "created_at"
  | "updated_at"
  | "phone"
  | "confirmed_at"
  | "email_confirmed_at"
  | "phone_confirmed_at"
  | "last_sign_in_at"
  | "role"
>;

/**
 * Session data returned from auth functions
 */
export type AuthSessionData = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: AuthUserData;
};

/**
 * Narrowed types for specific responses
 */
export type NarrowedUser = Pick<
  User,
  "id" | "email" | "user_metadata" | "app_metadata"
>;

export type NarrowedSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  token_type: string;
  user: NarrowedUser;
};

/**
 * Input types for auth functions
 */
export type Provider = "google" | "github" | "discord";

export type UserAuthUpdate = {
  email?: string;
  password?: string;
  data?: UserMetadata;
};

export type VerifyOtp = {
  email: string;
  token: string;
  type: "signup" | "email";
};

export type Resend = {
  type: "signup" | "email_change";
  email: string;
  redirectUrl?: string;
};
