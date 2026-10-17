import { z } from "zod";

export const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .max(254)
  .pipe(z.email("Enter a valid email address"));

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Enter your password").max(256),
});

export const passwordRules = z
  .string()
  .min(12, "Use at least 12 characters")
  .max(256, "Use 256 characters or fewer");

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  email: emailField,
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password").max(256),
    newPassword: passwordRules,
    confirmPassword: z.string(),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
