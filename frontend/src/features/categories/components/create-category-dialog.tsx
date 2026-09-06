"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ApiError } from "@/components/shared/api-error";

import { useCreateCategory } from "@/features/categories/hooks/use-create-category";

import {
  categorySchema,
  type CategoryFormValues,
} from "@/features/categories/schemas/create-category-schema";

export function CreateCategoryDialog() {
  const [open, setOpen] = useState(false);

  const mutation = useCreateCategory();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: CategoryFormValues) => {
    mutation.mutate(data.name, {
      onSuccess: () => {
        form.reset();
        setOpen(false);

        toast.add({
          title: "Category created",
          description: "The category was created successfully.",
          type: "success",
        });
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (!nextOpen) {
          mutation.reset();
        }
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-4" />
            New category
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add category</DialogTitle>

          <DialogDescription>
            Create a new category for support tickets.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="category-name" className="text-sm font-medium">
              Category name
            </label>

            <Input
              id="category-name"
              className="mt-2"
              placeholder="e.g. Finance"
              {...form.register("name")}
            />

            {form.formState.errors.name && (
              <p className="mt-1 text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {mutation.isError && <ApiError error={mutation.error} />}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Spinner className="size-4" />}
              Add category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
