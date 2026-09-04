"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { EyeIcon, EyeOffIcon } from "lucide-react";

import { login } from "@/features/auth/api/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getDashboardRoute } from "@/features/auth/utils/get-dashboard-route";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login-schema";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(["current-user"], user);
      router.replace(getDashboardRoute(user.role));
    },
  });
  const emailField = register("email");
  const passwordField = register("password");

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <Field data-invalid={!!errors.email}>
        <FieldLabel htmlFor="email">Email</FieldLabel>

        <Input
          id="email"
          type="email"
          placeholder="user@pwc.com"
          aria-invalid={!!errors.email}
          {...emailField}
          onChange={(event) => {
            emailField.onChange(event);
            loginMutation.reset();
          }}
        />

        <div className="min-h-1">
          <FieldError errors={[errors.email]} />
        </div>
      </Field>

      <Field data-invalid={!!errors.password}>
        <FieldLabel htmlFor="password">Password</FieldLabel>

        <InputGroup>
          <InputGroupInput
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            aria-invalid={!!errors.password}
            {...passwordField}
            onChange={(event) => {
              passwordField.onChange(event);
              loginMutation.reset();
            }}
          />

          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <div className="min-h-1">
          <FieldError errors={[errors.password]} />
        </div>
      </Field>

      <div className="flex flex-col gap-2">
        <div className="flex min-h-5 justify-center">
          {loginMutation.isError && (
            <p className="text-sm text-destructive">
              {loginMutation.error.message}
            </p>
          )}
        </div>
        <Button type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? "Signing in..." : "Sign in"}
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;
