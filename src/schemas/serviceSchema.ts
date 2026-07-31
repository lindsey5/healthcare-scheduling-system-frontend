import * as z from 'zod';

export const serviceSchema = z.object({
    serviceName: z
        .string()
        .min(1, "Service name is required")
        .max(100, "Service name must not exceed 100 characters"),
    dayOfWeek: z
        .string("Select the day this service will be available.")
        .min(1, "Select the day this service will be available."),
    startTime: z
        .string("Please select start time")
        .min(1, "Please select start time"),
    endTime: z
        .string("Please select end time")
        .min(1, "Please select end time")
        
});

export type ServiceFormData = z.infer<typeof serviceSchema>;