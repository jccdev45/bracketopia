import { CategoryCombobox } from "@/components/form/category-combobox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { TournamentCategory } from "@/constants/data";
import { useFieldContext, useFormContext } from "@/context/form-context";
import { cn } from "@/lib/utils";
import { useStore } from "@tanstack/react-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
  ...props
}: {
  label: string;
  placeholder?: string;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
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
        {...props}
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
  values,
  placeholder,
}: React.ComponentProps<"select"> & {
  label: string;
  placeholder: string;
  values: Array<{ value: string; label: string }>;
}) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="grid gap-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Select
        name={field.name}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {values.map((value) => (
              <SelectItem key={value.value} value={value.value}>
                {value.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  );
}

export function DateTimeField({
  label,
  description,
}: {
  label: string;
  description?: string;
}) {
  const field = useFieldContext<string | null>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="grid gap-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !field.state.value && "text-muted-foreground",
            )}
          >
            {field.state.value ? (
              format(new Date(field.state.value), "PPP p")
            ) : (
              <span>Pick a date and time</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            <Calendar
              mode="single"
              selected={
                field.state.value ? new Date(field.state.value) : undefined
              }
              onSelect={(date) => {
                if (date) {
                  // Preserve the current time if there's an existing value
                  const currentDate = field.state.value
                    ? new Date(field.state.value)
                    : new Date();
                  date.setHours(currentDate.getHours());
                  date.setMinutes(currentDate.getMinutes());
                  field.handleChange(date.toISOString());
                } else {
                  field.handleChange(null);
                }
              }}
              initialFocus
            />
            <div className="mt-3">
              <Input
                type="time"
                value={
                  field.state.value
                    ? format(new Date(field.state.value), "HH:mm")
                    : ""
                }
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(":");
                  const date = field.state.value
                    ? new Date(field.state.value)
                    : new Date();
                  date.setHours(Number.parseInt(hours, 10));
                  date.setMinutes(Number.parseInt(minutes, 10));
                  field.handleChange(date.toISOString());
                }}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  );
}
