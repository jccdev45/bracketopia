import { loginFormOpts, signUpFormOpts } from "@/utils/form-options";
import {
	ServerValidateError,
	createServerValidate,
	getFormData,
} from "@tanstack/react-form/start";
import { createServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";

const formOpts = { ...loginFormOpts, ...signUpFormOpts };

const serverValidate = createServerValidate({
	...formOpts,
	onServerValidate: ({ value }) => {
		if (value.username.length < 3) {
			return "Username must be more than 3 characters";
		}
	},
});

export const handleForm = createServerFn({
	method: "POST",
})
	.validator((data: unknown) => {
		if (!(data instanceof FormData)) {
			throw new Error("Invalid form data");
		}
		return data;
	})
	.handler(async (ctx) => {
		try {
			await serverValidate(ctx.data);
		} catch (e) {
			if (e instanceof ServerValidateError) {
				// Log form errors or do any other logic here
				return e.response;
			}

			// Some other error occurred when parsing the form
			console.error(e);
			setResponseStatus(500);
			return "There was an internal error";
		}

		return "Form has validated successfully";
	});

export const getFormDataFromServer = createServerFn({ method: "GET" }).handler(
	async () => {
		return getFormData();
	},
);
