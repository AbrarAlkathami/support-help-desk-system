import { z } from "zod";

export const createTicketSchema = z.object({
  subject: z
    .string()
    .min(1, "Subject is required"),

  description: z
    .string()
    .min(1, "Description is required"),

  categoryId: z
    .string()
    .min(1, "Category is required"),
});

export type CreateTicketFormValues = z.infer<
  typeof createTicketSchema
>;