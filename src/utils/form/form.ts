// src/utils/form/form.ts
import { createServerFn } from "@tanstack/react-start";

export const handleForm = createServerFn({
  method: "POST",
})
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data");
    }
    return data;
  })
  .handler(async () => {
    // This is just a placeholder.  We're doing validation in the onSubmit now.
    return "Form has validated successfully";
  });

export const getFormDataFromServer = createServerFn({ method: "GET" }).handler(
  async () => {
    return {}; // Return an empty object, as we are not using the pre-filled form data
  },
);
