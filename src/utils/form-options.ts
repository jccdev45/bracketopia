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

export const formOpts = { ...loginFormOpts, ...signUpFormOpts };
