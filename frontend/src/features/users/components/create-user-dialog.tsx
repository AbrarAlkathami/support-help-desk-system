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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ApiError } from "@/components/shared/api-error";

import { useCreateUser } from "@/features/users/hooks/use-create-user";

import {
  createUserSchema,
  type CreateUserFormValues,
} from "@/features/users/schemas/create-user-schema";

const roleOptions = [
  { label: "User", value: "user" },
  { label: "Moderator", value: "moderator" },
  { label: "Admin", value: "admin" },
];

export function CreateUserDialog() {
  const mutation = useCreateUser();
  const [open, setOpen] = useState(false);
  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  const onSubmit = (data: CreateUserFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        setOpen(false);

        toast.add({
          title: "Account created",
          description: "The account was created successfully.",
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
      {" "}
      <DialogTrigger
        render={
          <Button className="bg-trinidad-500 text-white hover:bg-trinidad-600 hover:text-white" />
        }
      >
        <Plus className="size-4" />
        New account
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create account</DialogTitle>

          <DialogDescription>
            Add a new platform user or support agent.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>

            <Input id="name" className="mt-2" {...form.register("name")} />

            {form.formState.errors.name && (
              <p className="mt-1 text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>

            <Input
              id="email"
              type="email"
              className="mt-2"
              {...form.register("email")}
            />

            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>

            <Input
              id="password"
              type="password"
              className="mt-2"
              {...form.register("password")}
            />

            {form.formState.errors.password && (
              <p className="mt-1 text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Role</label>

            <Select
              items={roleOptions}
              value={form.watch("role")}
              onValueChange={(value) => {
                if (!value) return;

                form.setValue("role", value as CreateUserFormValues["role"], {
                  shouldValidate: true,
                });
              }}
            >
              <SelectTrigger className="mt-2 w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {mutation.isError && <ApiError error={mutation.error} />}

          <div className="flex justify-end">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Spinner className="size-4" />}
              <Plus className="size-4" />
              Add account
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
