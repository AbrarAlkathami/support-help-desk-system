import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters."),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters."),

  role: z.enum([
    "user",
    "moderator",
    "admin",
  ]),
});

export type CreateUserFormValues =
  z.infer<typeof createUserSchema>;