import { createFormHook } from "@tanstack/react-form";

import {
  SelectField,
  SubscribeButton,
  TextArea,
  TextField,
} from "../components/form/form-components";
import { fieldContext, formContext } from "../context/form-context";

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    SelectField,
    TextArea,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
});
