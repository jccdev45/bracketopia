import { formOptions } from "@tanstack/react-form";

const sharedOpts = {
  email: "",
  password: "",
};

export const signUpFormOpts = formOptions({
  defaultValues: {
    ...sharedOpts,
    username: "",
    confirmPassword: "",
  },
});

export const loginFormOpts = formOptions({
  defaultValues: sharedOpts,
});

export const authFormOpts = { ...loginFormOpts, ...signUpFormOpts };

export const addTournamentFormOpts = formOptions({
  defaultValues: {
    title: "",
    description: "",
    max_participants: 8,
    registration_open: true,
  },
});
