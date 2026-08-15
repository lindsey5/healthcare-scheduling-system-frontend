import z from "zod";

export const ProfileSchema = z.object({
    email: z.string()
        .min(1, "Email is required")
        .email("Invalid email address")
        .max(100, "Email must not exceed 100 characters")
        .optional(),
    firstname: z.string()
        .min(1, "Firstname is required")
        .max(50, "Firstname must not exceed 50 characters"),

    lastname: z.string()
        .min(1, "Lastname is required")
        .max(50, "Lastname must not exceed 50 characters"),
})

export type ProfileFormData = z.infer<typeof ProfileSchema>;

export const PasswordSchema = z.object({
    currentPassword: z.string()
        .min(1, "Current password is required"),

    newPassword: z.string()
        .min(12, "New password must be at least 12 characters")
        .max(100, "New password must not exceed 100 characters")
        .regex(/[A-Z]/, "Must include at least 1 uppercase letter")
        .regex(/[a-z]/, "Must include at least 1 lowercase letter")
        .regex(/[0-9]/, "Must include at least 1 number")
        .regex(/[^A-Za-z0-9]/, "Must include atleast 1 special character"),

    confirmPassword: z.string()
        .min(1, "Please confirm your password"),
})
.refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type PasswordFormData = z.infer<typeof PasswordSchema>;