import { createFormHook } from "@tanstack/react-form";

import {
  CategoryField,
  SelectField,
  SliderField,
  SubscribeButton,
  SwitchField,
  TextArea,
  TextField,
} from "../components/form/form-components";
import { fieldContext, formContext } from "../context/form-context";

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    SelectField,
    TextArea,
    SliderField,
    CategoryField,
    SwitchField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
});
