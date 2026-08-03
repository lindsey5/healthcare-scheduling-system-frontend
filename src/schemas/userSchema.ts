import z from "zod";

export const CreateUserSchema = z.object({
    firstname: z.string()
        .min(1, "Firstname is required")
        .max(50, "Firstname must not exceed 50 characters"),

    lastname: z.string()
        .min(1, "Lastname is required")
        .max(50, "Lastname must not exceed 50 characters"),

    email: z.string()
        .min(1, "Email is required")
        .email("Invalid email address")
        .max(100, "Email must not exceed 100 characters"),
    
    password: z.string()
        .min(12, "Password must be at least 12 characters")
        .max(100, "Password must not exceed 100 characters")
        .regex(/[A-Z]/, "Must include at least 1 uppercase letter")
        .regex(/[a-z]/, "Must include at least 1 lowercase letter")
        .regex(/[0-9]/, "Must include at least 1 number")
        .regex(/[^A-Za-z0-9]/, "Must include atleast 1 special character"),

    confirmPassword: z.string()
        .min(1, "Please confirm your password"),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type CreateUserFormData = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z
    .object({
        firstname: z.string()
            .min(1, "Firstname is required")
            .max(50, "Firstname must not exceed 50 characters"),

        lastname: z.string()
            .min(1, "Lastname is required")
            .max(50, "Lastname must not exceed 50 characters"),

        email: z.string()
            .min(1, "Email is required")
            .email("Invalid email address")
            .max(100, "Email must not exceed 100 characters"),

        password: z.string()
            .min(12, "Password must be at least 12 characters")
            .max(100, "Password must not exceed 100 characters")
            .regex(/[A-Z]/, "Must include at least 1 uppercase letter")
            .regex(/[a-z]/, "Must include at least 1 lowercase letter")
            .regex(/[0-9]/, "Must include at least 1 number")
            .regex(/[^A-Za-z0-9]/, "Must include at least 1 special character")
            .optional()
            .or(z.literal("")),

        confirmPassword: z.string()
            .optional()
            .or(z.literal("")),
    })
    .refine(
        (data) => {
            // If neither password nor confirmPassword is provided, allow update.
            if (!data.password && !data.confirmPassword) {
                return true;
            }

            // If one is provided, both are required.
            if (!data.password || !data.confirmPassword) {
                return false;
            }

            return data.password === data.confirmPassword;
        },
        {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        }
    );

export type UpdateUserFormData = z.infer<typeof UpdateUserSchema>;