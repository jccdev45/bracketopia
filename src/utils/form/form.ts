import { authFormOpts } from "@/utils/form/form-options";
import {
  ServerValidateError,
  createServerValidate,
  getFormData,
} from "@tanstack/react-form/start";
import { createServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";

// TODO: Verify what server-side validation is needed
const serverValidate = createServerValidate({
  ...authFormOpts,
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
  // NOTE: this whole function is direct from https://github.com/TanStack/form/blob/fed72edb6c780f06e013d5d617a505eb4649be79/examples/react/tanstack-start/app/utils/form.tsx#L19
  // idk why handler errors, I'm probably fucking something up somewhere
  // @ts-expect-error
  .handler(async (ctx) => {
    try {
      await serverValidate(ctx.data);
    } catch (e) {
      if (e instanceof ServerValidateError) {
        return e.response;
      }

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
