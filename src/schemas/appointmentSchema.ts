import * as z from "zod";

export const appointmentSchema = z.object({
    appointmentDate: z
        .string("Select preferred appointment date")
        .min(1, "Select preferred appointment date"),

    serviceId: z
        .number("Select preferred service")
        .min(1, "Select preferred service"),

    doctorId: z
        .number("Select preferred doctor")
        .min(1, "Select preferred doctor"),

    appointmentTime: z
        .string("Select preferred time")
        .min(1, "Select preferred time"),

    purposeOfVisit: z
        .string("Please enter the purpose of your visit")
        .min(1, "Please enter the purpose of your visit")
        .max(500, "Must not exceed 500 characters")
        .trim()
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;