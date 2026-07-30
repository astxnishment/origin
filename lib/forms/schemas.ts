import { z } from "zod";
import { BRANDS, REPAIR_TYPES } from "@/lib/calculatorData";

export const REQUEST_TIME_SLOTS = [
  "9:00am",
  "10:00am",
  "11:00am",
  "12:00pm",
  "1:00pm",
  "2:00pm",
  "3:00pm",
  "4:00pm",
  "5:00pm",
] as const;

const singleLine = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} is too long.`)
    .refine(
      (value) => !/[\r\n\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value),
      `${label} contains unsupported characters.`
    );

const optionalSingleLine = (label: string, max: number) =>
  z
    .string()
    .trim()
    .max(max, `${label} is too long.`)
    .refine(
      (value) => !/[\r\n\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value),
      `${label} contains unsupported characters.`
    )
    .optional()
    .default("");

const multiLine = (label: string, max: number) =>
  z
    .string()
    .trim()
    .max(max, `${label} is too long.`)
    .refine(
      (value) => !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value),
      `${label} contains unsupported characters.`
    )
    .optional()
    .default("");

const email = z
  .string()
  .trim()
  .max(254)
  .email("Enter a valid email address.")
  .transform((value) => value.toLowerCase());

const phone = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number.")
  .max(25, "Enter a valid phone number.")
  .regex(
    /^\+?[0-9][0-9\s().-]{5,23}[0-9]$/,
    "Enter a valid UK or international phone number."
  );

const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date.")
  .refine((value) => {
    const selected = new Date(`${value}T12:00:00Z`);
    return !Number.isNaN(selected.getTime());
  }, "Choose a valid date.")
  .refine((value) => {
    const selected = new Date(`${value}T12:00:00Z`);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return selected >= today;
  }, "Choose a date that has not passed.")
  .refine((value) => {
    const selected = new Date(`${value}T12:00:00Z`);
    const latest = new Date();
    latest.setUTCFullYear(latest.getUTCFullYear() + 1);
    return selected <= latest;
  }, "Choose a date within the next year.")
  .refine(
    (value) => new Date(`${value}T12:00:00Z`).getUTCDay() !== 0,
    "Sunday requests are unavailable."
  );

const antiSpamFields = {
  website: z.string().max(0).optional().default(""),
  formStartedAt: z.number().int().positive(),
  turnstileToken: z.string().trim().max(2048).optional().default(""),
  idempotencyKey: z
    .string()
    .trim()
    .min(16)
    .max(128)
    .regex(/^[A-Za-z0-9_-]+$/, "Invalid request key."),
};

export const bookingRequestSchema = z
  .object({
    name: singleLine("Name", 100),
    email,
    phone,
    serviceMethod: z.enum(["drop-off", "mail-in"]),
    returnAddress: multiLine("Return address", 500),
    deviceType: z.enum([
      "phone",
      "tablet",
      "laptop",
      "console",
      "desktop",
    ]),
    brand: z.union([z.enum(BRANDS), z.literal("")]).default(""),
    model: singleLine("Model", 120),
    modelId: optionalSingleLine("Model ID", 120),
    repair: z.enum(REPAIR_TYPES),
    partTierId: optionalSingleLine("Part tier", 120),
    catalogueId: optionalSingleLine("Catalogue ID", 180),
    date,
    time: z.enum(REQUEST_TIME_SLOTS),
    issue: multiLine("Issue description", 2000),
    consentToContact: z.literal(true, {
      error: "Consent to contact is required.",
    }),
    ...antiSpamFields,
  })
  .superRefine((value, context) => {
    if (value.serviceMethod === "mail-in" && !value.returnAddress) {
      context.addIssue({
        code: "custom",
        path: ["returnAddress"],
        message: "A return address is required for mail-in requests.",
      });
    }

    if (
      ["phone", "tablet", "laptop"].includes(value.deviceType) &&
      (!value.brand || !value.modelId)
    ) {
      context.addIssue({
        code: "custom",
        path: ["modelId"],
        message: "Choose a supported brand and model.",
      });
    }
  });

export const contactRequestSchema = z.object({
  name: singleLine("Name", 100),
  email,
  phone: phone.optional().or(z.literal("")).default(""),
  device: optionalSingleLine("Device", 120),
  issue: singleLine("Message", 3000),
  consentToContact: z.literal(true, {
    error: "Consent to contact is required.",
  }),
  ...antiSpamFields,
});

export const accountAccessSchema = z.object({
  email,
  next: z
    .string()
    .trim()
    .max(200)
    .refine(
      (value) =>
        value === "" || (value.startsWith("/") && !value.startsWith("//")),
      "Invalid account destination."
    )
    .optional()
    .default("/account"),
  website: z.string().max(0).optional().default(""),
  formStartedAt: z.number().int().positive(),
  turnstileToken: z.string().trim().max(2048).optional().default(""),
});

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;
export type ContactRequestInput = z.infer<typeof contactRequestSchema>;
export type AccountAccessInput = z.infer<typeof accountAccessSchema>;
