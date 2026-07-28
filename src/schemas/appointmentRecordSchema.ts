import z from "zod";

const phoneRegex = /^09\d{9}$/;

export const AppointmentRecordSchema = z.object({
    firstName: z.string()
        .min(1, "First name is required")
        .max(100, "First name must not exceed 100 characters"),

    middleName: z.string()
        .max(100, "Middle name must not exceed 100 characters")
        .optional(),

    lastName: z.string()
        .min(1, "Last name is required")
        .max(100, "Last name must not exceed 100 characters"),

    suffix: z.string("Select suffix")
        .min(1, "Select suffix"),

    birthDate: z.string()
        .min(1, "Select birth date"),

    gender: z.string("Select gender")
        .min(1, "Select gender"),

    contactNumber: z.string()
        .min(1, "Contact number is required")
        .regex(
            phoneRegex,
            "Invalid contact number (e.g. 09123456789)"
        ),
    
    civilStatus: z.string("Civil status is required")
        .min(1, "Civil status is required"),

    email: z.string()
        .email("Invalid email address")
        .max(100, "Email must not exceed 100 characters")
        .optional()
        .or(z.literal("")),

    completeAddress: z.string()
        .min(1, "Complete address is required")
        .max(100, "Complete address must not exceed 100 characters"),

    emergencyContactPerson: z.string()
        .max(100, "Emergency contact person must not exceed 100 characters")
        .optional(),

    emergencyContactNumber: z.string()
        .optional()
        .or(z.literal(""))
        .refine(
            (value) => !value || phoneRegex.test(value),
            {
                message:
                    "Invalid contact number (e.g. 09123456789)",
            }
        ),
});

export type AppointmentRecordFormData = z.infer<typeof AppointmentRecordSchema>;