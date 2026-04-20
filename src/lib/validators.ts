import { z } from "zod";

export const SignupSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(80),
    email: z.string().trim().toLowerCase().email("Enter a valid email").max(254),
    password: z.string().min(8, "Password must be at least 8 characters").max(128),
  })
  .strict();

export const ClientCreateSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(120),
    email: z.string().trim().toLowerCase().email("Enter a valid email").max(254),
    company: z.string().trim().max(120).optional().nullable(),
    phone: z.string().trim().max(40).optional().nullable(),
    address: z.string().trim().max(500).optional().nullable(),
    notes: z.string().trim().max(2000).optional().nullable(),
  })
  .strict();

export const ClientUpdateSchema = ClientCreateSchema.partial().strict();

export const InvoiceItemSchema = z
  .object({
    description: z.string().trim().min(1, "Description required").max(500),
    quantity: z.number().positive("Quantity must be positive").max(100000),
    rate: z.number().positive("Rate must be positive").max(10_000_000),
  })
  .strict();

export const Currency = z.enum(["INR", "USD", "EUR", "GBP"]);
const Intent = z.enum(["draft", "send"]).default("draft");

export const InvoiceCreateSchema = z
  .object({
    clientId: z.string().min(1, "Client is required"),
    projectId: z.string().optional().nullable(),
    dueDate: z.string().refine((s) => !Number.isNaN(Date.parse(s)), "Invalid due date"),
    currency: Currency.default("INR"),
    notes: z.string().max(2000).optional().nullable(),
    tax: z.number().nonnegative().max(10_000_000).default(0),
    intent: Intent,
    items: z.array(InvoiceItemSchema).min(1, "At least one line item required").max(50),
  })
  .strict();

const InvoiceStatus = z.enum([
  "DRAFT",
  "SENT",
  "VIEWED",
  "PAID",
  "OVERDUE",
  "CANCELLED",
]);

export const InvoiceUpdateSchema = z
  .object({
    status: InvoiceStatus.optional(),
    notes: z.string().max(2000).optional().nullable(),
  })
  .strict();

export const TimeEntryCreateSchema = z
  .object({
    projectId: z.string().min(1, "Project required"),
    description: z.string().max(500).optional().nullable(),
    startTime: z.string().refine((s) => !Number.isNaN(Date.parse(s)), "Invalid start time"),
    endTime: z
      .string()
      .refine((s) => !Number.isNaN(Date.parse(s)), "Invalid end time")
      .optional()
      .nullable(),
    duration: z.number().int().nonnegative().max(60 * 60 * 24 * 7).optional().nullable(),
    billable: z.boolean().default(true),
  })
  .strict();

export type SignupInput = z.infer<typeof SignupSchema>;
export type ClientCreateInput = z.infer<typeof ClientCreateSchema>;
export type InvoiceCreateInput = z.infer<typeof InvoiceCreateSchema>;

/**
 * Convert a Zod error into a flat human-readable message.
 */
export function zodErrorMessage(err: z.ZodError): string {
  return err.issues.map((i) => i.message).join(", ");
}
