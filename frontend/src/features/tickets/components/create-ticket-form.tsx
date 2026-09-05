"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import {
  createTicketSchema,
  type CreateTicketFormValues,
} from "@/features/tickets/schemas/create-ticket-schema";

import { useCategories } from "@/features/categories/hooks/use-categories";
import { useCreateTicket } from "@/features/tickets/hooks/use-create-ticket";
import { ApiError } from "@/components/shared/api-error";

interface CreateTicketFormProps {
  onSuccess: () => void;
}

export function CreateTicketForm({ onSuccess }: CreateTicketFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      subject: "",
      description: "",
      categoryId: "",
    },
  });

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useCategories();

  const createTicketMutation = useCreateTicket();

  const categoryId = watch("categoryId");

  const onSubmit = (data: CreateTicketFormValues) => {
    createTicketMutation.mutate(data, {
      onSuccess: () => {
        reset();

        toast.add({
          title: "Ticket created",
          description: "Your support ticket was created successfully.",
          type: "success",
        });

        onSuccess();
      },
    });
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field data-invalid={!!errors.subject}>
        <FieldLabel htmlFor="subject">Subject</FieldLabel>

        <Input
          id="subject"
          placeholder="Briefly describe the issue"
          aria-invalid={!!errors.subject}
          {...register("subject")}
        />

        <FieldError errors={[errors.subject]} />
      </Field>

      <Field data-invalid={!!errors.categoryId}>
        <FieldLabel>Category</FieldLabel>

        <Select
          value={categoryId}
          onValueChange={(value) => {
            setValue("categoryId", value ?? "", {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
          disabled={isCategoriesLoading}
        >
          <SelectTrigger
            id="category"
            className="w-full"
            aria-invalid={!!errors.categoryId}
          >
            <SelectValue placeholder="Select a category">
              {(value) => {
                if (isCategoriesLoading) {
                  return <Spinner className="size-4" />;
                }

                const selectedCategory = categories?.find(
                  (category) => category.id === value,
                );

                return selectedCategory?.name ?? "";
              }}
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <FieldError errors={[errors.categoryId]} />

        {isCategoriesError && (
          <p className="text-sm text-destructive">Could not load categories.</p>
        )}
      </Field>

      <Field data-invalid={!!errors.description}>
        <FieldLabel htmlFor="description">Description</FieldLabel>

        <Textarea
          id="description"
          placeholder="Describe what happened and any relevant details..."
          rows={6}
          aria-invalid={!!errors.description}
          {...register("description")}
        />

        <FieldError errors={[errors.description]} />
      </Field>

      {createTicketMutation.isError && (
        <ApiError error={createTicketMutation.error} />
      )}
      <Button
        type="submit"
        className="w-full"
        disabled={createTicketMutation.isPending}
      >
        {createTicketMutation.isPending && <Spinner className="size-4" />}
        Create ticket
      </Button>
    </form>
  );
}
