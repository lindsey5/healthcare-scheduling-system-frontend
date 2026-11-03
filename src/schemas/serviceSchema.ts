import * as z from 'zod';

export const serviceSchema = z.object({
    serviceName: z
        .string()
        .min(1, "Service name is required")
        .max(100, "Service name must not exceed 100 characters"),
    dayOfWeek: z
        .string()
        .min(1, "Select the day this service will be available."),
    startTime: z.string().min(1, "Select a service start time"),
    endTime: z.string().min(1, "Select a service end time"),
    doctors: z
        .array(
            z
                .object({
                    doctorId: z.number().int().positive("Select a doctor"),
                    startTime: z.string().min(1, "Select a start time"),
                    endTime: z.string().min(1, "Select an end time"),
                })
                .refine((schedule) => schedule.endTime > schedule.startTime, {
                    message: "End time must be later than start time",
                    path: ["endTime"],
                })
        )
        .refine(
            (doctors) =>
                new Set(doctors.map(({ doctorId }) => doctorId)).size ===
                doctors.length,
            "A doctor can only be assigned once to a service."
        )
        .superRefine((doctors, context) => {
            for (let index = 0; index < doctors.length; index += 1) {
                const current = doctors[index];
                if (!current.startTime || !current.endTime) {
                    continue;
                }

                for (
                    let otherIndex = index + 1;
                    otherIndex < doctors.length;
                    otherIndex += 1
                ) {
                    const other = doctors[otherIndex];
                    if (
                        other.startTime &&
                        other.endTime &&
                        current.startTime < other.endTime &&
                        other.startTime < current.endTime
                    ) {
                        context.addIssue({
                            code: "custom",
                            message: "This time overlaps another doctor's schedule for this service.",
                            path: [otherIndex, "startTime"],
                        });
                    }
                }
            }
        }),
}).superRefine((service, context) => {
    if (
        service.startTime &&
        service.endTime &&
        service.endTime <= service.startTime
    ) {
        context.addIssue({
            code: "custom",
            message: "Service end time must be later than its start time",
            path: ["endTime"],
        });
    }

    service.doctors.forEach((doctor, index) => {
        if (
            doctor.startTime &&
            service.startTime &&
            doctor.startTime < service.startTime
        ) {
            context.addIssue({
                code: "custom",
                message: "Doctor schedule must start at or after the service starts.",
                path: ["doctors", index, "startTime"],
            });
        }
        if (
            doctor.endTime &&
            service.endTime &&
            doctor.endTime > service.endTime
        ) {
            context.addIssue({
                code: "custom",
                message: "Doctor schedule must end at or before the service ends.",
                path: ["doctors", index, "endTime"],
            });
        }
    });
});

export type ServiceFormData = z.infer<typeof serviceSchema>;