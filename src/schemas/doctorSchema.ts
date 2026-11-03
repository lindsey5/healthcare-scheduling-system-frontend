import * as z from "zod";

export const doctorSchema = z.object({
    firstname: z
        .string("Please enter the doctor's first name")
        .min(1, "Please enter the doctor's first name")
        .max(100, "First name must not exceed 100 characters")
        .trim(),

    lastname: z
        .string("Please enter the doctor's last name")
        .min(1, "Please enter the doctor's last name")
        .max(100, "Last name must not exceed 100 characters")
        .trim(),
    serviceIds: z
        .array(z.number().int().positive("Select a service"))
        .refine(
            (serviceIds) =>
                new Set(serviceIds).size === serviceIds.length,
            "A service can only be assigned once."
        ),
});

export type DoctorFormData = z.infer<typeof doctorSchema>;