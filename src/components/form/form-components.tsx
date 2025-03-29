import { CategoryCombobox } from "@/components/form/category-combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { TournamentCategory } from "@/constants/data";
import { useFieldContext, useFormContext } from "@/context/form-context";
import { type Updater, useStore } from "@tanstack/react-form";

export function SliderField({
  label,
  min,
  max,
  step = 1,
}: {
  label: string;
  min: number;
  max: number;
  step?: number;
}) {
  const field = useFieldContext<number>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>
        {label}: {field.state.value}
      </Label>
      <Slider
        id={field.name}
        name={field.name}
        min={min}
        max={max}
        onValueChange={(values) => field.handleChange(values[0])}
        step={step}
        value={[field.state.value]}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  );
}

export function CategoryField({ label }: { label: string }) {
  const field = useFieldContext<TournamentCategory>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <CategoryCombobox
        value={field.state.value}
        onChange={(value) => {
          field.handleChange(value as TournamentCategory);
          field.handleBlur();
        }}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  );
}

export function SwitchField({
  label,
}: {
  label: string;
}) {
  const field = useFieldContext<boolean>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>{label}</Label>
      <div className="flex items-center gap-2">
        <Switch
          id={field.name}
          checked={field.state.value}
          onCheckedChange={field.handleChange}
        />
        <span>{field.state.value ? "Open" : "Closed"}</span>
      </div>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  );
}

export function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting}>
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
          className="mt-1 font-bold text-destructive text-sm"
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
  type = "text",
}: { label: string; placeholder?: string; type?: string }) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        placeholder={placeholder}
        type={type}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className="w-full"
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  );
}

export function TextArea({
  label,
  rows = 3,
  placeholder,
}: React.ComponentProps<"textarea"> & {
  label: string;
}) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name} className="grid">
        {label}
        <Textarea
          id={field.name}
          name={field.name}
          value={field.state.value}
          placeholder={placeholder}
          onBlur={field.handleBlur}
          rows={rows}
          onChange={(e) => field.handleChange(e.target.value)}
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
      <Label htmlFor={field.name}>{label}</Label>
      <select
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e: { target: { value: Updater<string> } }) =>
          field.handleChange(e.target.value)
        }
        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {children}
      </select>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  );
}
