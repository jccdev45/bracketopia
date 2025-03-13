import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type Updater, useStore } from "@tanstack/react-form";
import type { VariantProps } from "class-variance-authority";
import { useFieldContext, useFormContext } from "../../context/form-context";

export function SubscribeButton({
  label,
}: React.ComponentProps<"button"> &
  VariantProps<typeof Button> & { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          disabled={isSubmitting}
          // previous style: className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
        >
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
}

function ErrorMessages({
  errors,
}: {
  errors: Array<string | { message: string }>;
}) {
  return (
    <>
      {errors.map((error) => (
        <div
          key={typeof error === "string" ? error : error.message}
          className="text-destructive text-sm mt-1 font-bold"
        >
          {typeof error === "string" ? error : error.message}
        </div>
      ))}
    </>
  );
}

export function TextField({
  label,
  placeholder,
  type,
}: React.ComponentProps<"input"> & { label: string }) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="space-y-2">
      {/* previous label style: className="block font-bold mb-1 text-xl" */}
      <Label htmlFor={label} className="grid">
        {label}
        <Input
          value={field.state.value}
          placeholder={placeholder}
          onBlur={field.handleBlur}
          type={type}
          onChange={(e) => field.handleChange(e.target.value)}
          className="w-full"
          // previous style: className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </Label>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  );
}

export function TextArea({
  label,
  rows = 3,
}: React.ComponentProps<"textarea"> & {
  label: string;
}) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="space-y-2">
      {/* previous label style: className="block font-bold mb-1 text-xl" */}
      <Label htmlFor={label} className="grid">
        {label}
        <Textarea
          value={field.state.value}
          onBlur={field.handleBlur}
          rows={rows}
          onChange={(e) => field.handleChange(e.target.value)}
          // previous style: className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </Label>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  );
}

export function SelectField({
  label,
  children,
}: React.ComponentProps<"select"> & {
  label: string;
  children: React.ReactNode;
}) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="grid gap-2">
      {/* previous label style: className="block font-bold mb-1 text-xl" */}
      <Label htmlFor={label}>{label}</Label>
      <select
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e: { target: { value: Updater<string> } }) =>
          field.handleChange(e.target.value)
        }
        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {children}
      </select>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  );
}
