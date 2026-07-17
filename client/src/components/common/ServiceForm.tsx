import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ICategory } from "@/types/service.types";
import { type IServiceInput } from "@/services/service.api";

// Mirrors server/src/validators/provider.validator.ts serviceSchema.
// PUT /services/:id requires the full payload every time, so this one
// schema covers both create and edit.
const serviceFormSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  categoryId: z.string().min(1, "Pick a category"),
  subcategory: z.string().optional(),
  pricingType: z.enum(["fixed", "hourly", "custom"]),
  price: z.number().nonnegative().optional().nullable(),
});
type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
  categories: ICategory[];
  defaultValues?: Partial<ServiceFormValues>;
  submitLabel: string;
  onSubmit: (values: IServiceInput) => Promise<void>;
  onCancel: () => void;
}

export const ServiceForm = ({
  categories,
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
}: ServiceFormProps) => {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      subcategory: "",
      pricingType: "fixed",
      price: undefined,
      ...defaultValues,
    },
  });

  const pricingType = form.watch("pricingType");

  const handleSubmit = async (values: ServiceFormValues) => {
    await onSubmit({
      ...values,
      price: values.pricingType === "custom" ? null : (values.price ?? null),
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      {/* Title */}
      <Controller
        control={form.control}
        name="title"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Title</FieldLabel>
            <Input
              id={field.name}
              placeholder="e.g. Kitchen sink repair"
              aria-invalid={fieldState.invalid}
              {...field}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      {/* Description */}
      <Controller
        control={form.control}
        name="description"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Description</FieldLabel>
            <Textarea
              id={field.name}
              rows={4}
              placeholder="What's included, how long it takes, etc."
              aria-invalid={fieldState.invalid}
              {...field}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      {/* Category */}
      <Controller
        control={form.control}
        name="categoryId"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Category</FieldLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger
                id={field.name}
                className="w-full"
                aria-invalid={fieldState.invalid}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      {/* Subcategory */}
      <Controller
        control={form.control}
        name="subcategory"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Subcategory (optional)</FieldLabel>
            <Input
              id={field.name}
              placeholder="e.g. Leak repair"
              aria-invalid={fieldState.invalid}
              {...field}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      {/* Pricing Type */}
      <Controller
        control={form.control}
        name="pricingType"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Pricing type</FieldLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger
                id={field.name}
                className="w-full"
                aria-invalid={fieldState.invalid}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed price</SelectItem>
                <SelectItem value="hourly">Hourly rate</SelectItem>
                <SelectItem value="custom">Custom quote</SelectItem>
              </SelectContent>
            </Select>
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      {/* Price */}
      {pricingType !== "custom" && (
        <Controller
          control={form.control}
          name="price"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {pricingType === "hourly" ? "Rate per hour" : "Price"}
              </FieldLabel>
              <Input
                id={field.name}
                type="number"
                min={0}
                step="0.01"
                aria-invalid={fieldState.invalid}
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? undefined : Number(e.target.value),
                  )
                }
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
