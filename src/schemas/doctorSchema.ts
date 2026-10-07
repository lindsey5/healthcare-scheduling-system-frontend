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

    schedules: z
        .array(
            z.object({
                day: z.enum([
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                ]),

                startTime: z
                    .string()
                    .min(1, "Please enter the start time"),

                endTime: z
                    .string()
                    .min(1, "Please enter the end time"),
            })
        )
        .min(1, "Please add at least one schedule"),
});

export type DoctorFormData = z.infer<typeof doctorSchema>;

export const scheduleSchema = z
    .object({
        day: z.string().min(1, "Please select a day"),
        startTime: z
            .string()
            .min(1, "Please select a start time"),
        endTime: z
            .string()
            .min(1, "Please select an end time"),
    })
    .refine(
        (data) => {
            if (!data.startTime || !data.endTime) {
                return true;
            }

            return data.endTime > data.startTime;
        },
        {
            message: "End time must be later than start time",
            path: ["endTime"],
        }
    );

export type ScheduleFormData = z.infer<typeof scheduleSchema>;