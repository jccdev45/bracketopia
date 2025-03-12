import type { LoginSchemaValues, SignupSchemaValues } from "@/schema/auth";
import type {
  Provider,
  Resend,
  UserAuthUpdate,
  VerifyOtp,
} from "@/types/auth.types";
import {
  emailPasswordLoginFn,
  fetchUserFn,
  magicLinkLoginFn,
  providerLoginFn,
  resendFn,
  signupFn,
  updateUserFn,
  verifyOtpFn,
} from "@/utils/serverFn/auth";
import { queryOptions } from "@tanstack/react-query";

export const authQueryOptions = {
  user: () =>
    queryOptions({
      queryKey: ["auth", "user"],
      queryFn: () => fetchUserFn(),
    }),
  login: (data: LoginSchemaValues) =>
    queryOptions({
      queryKey: ["auth", "login", data.email],
      queryFn: async () => emailPasswordLoginFn({ data }),
    }),
  signUp: (data: SignupSchemaValues) =>
    queryOptions({
      queryKey: ["auth", "signUp", data.email],
      queryFn: async () => signupFn({ data }),
    }),
  magicLink: (data: { email: string; redirectUrl?: string }) =>
    queryOptions({
      queryKey: ["auth", "magicLink", data.email],
      queryFn: async () => magicLinkLoginFn({ data }),
    }),
  verifyOtp: (data: VerifyOtp) =>
    queryOptions({
      queryKey: ["auth", "verify", data.email],
      queryFn: async () => verifyOtpFn({ data }),
    }),
  providerLogin: (data: { provider: Provider; token: string }) =>
    queryOptions({
      queryKey: ["auth", "providerLogin", data.token],
      queryFn: async () => providerLoginFn({ data }),
    }),
  updateUser: (data: UserAuthUpdate, id: string) =>
    queryOptions({
      queryKey: ["auth", "update", id],
      queryFn: async () => updateUserFn({ data }),
    }),
  resend: (data: Resend) =>
    queryOptions({
      queryKey: ["auth", "resend", data.email],
      queryFn: async () => resendFn({ data }),
    }),
};
