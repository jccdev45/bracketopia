import { formOptions } from "@tanstack/react-form";

export const formOpts = formOptions({
	defaultValues: {
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	},
});
