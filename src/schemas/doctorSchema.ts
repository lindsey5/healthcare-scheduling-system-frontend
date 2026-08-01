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

    doctorServices: z
        .array(z.number())
        .min(1, "Please add at least one service"),
});

export type DoctorFormData = z.infer<typeof doctorSchema>;