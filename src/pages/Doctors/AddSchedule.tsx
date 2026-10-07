import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Dropdown from "../../components/ui/Dropdown";
import Button from "../../components/ui/Button";
import { DAYS, timeSlots } from "../../lib/contants/constants";
import {
    scheduleSchema,
    type ScheduleFormData,
} from "../../schemas/doctorSchema";

type AddScheduleProps = {
    onAdd: (data: ScheduleFormData) => void;
    onClose: () => void;
    existingDays?: string[];
};

export default function AddSchedule({
    onAdd,
    onClose,
    existingDays = [],
}: AddScheduleProps) {
    const {
        watch,
        setValue,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ScheduleFormData>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            day: "",
            startTime: "",
            endTime: "",
        },
    });

    const day = watch("day");
    const startTime = watch("startTime");
    const endTime = watch("endTime");

    const dayOptions = useMemo(() => {
        return DAYS
            .filter((day) => !existingDays.includes(day))
            .map((day) => ({
                label: day,
                value: day,
            }));
    }, [existingDays]);

    const endTimeOptions = useMemo(() => {
        if (!startTime) {
            return timeSlots;
        }

        return timeSlots.filter(
            (time) => time.value > startTime
        );
    }, [startTime]);

    const onSubmit = (data: ScheduleFormData) => {
        onAdd(data);
        reset();
    };

    return (
        <div className="space-y-3">
            {/* Day */}
            <Dropdown
                className="text-sm"
                options={dayOptions}
                value={day}
                onChange={(e) =>
                    setValue("day", e.target.value, {
                        shouldValidate: true,
                        shouldDirty: true,
                    })
                }
                placeholder="Select day"
                error={errors.day?.message}
            />

            {/* Time */}
            <div className="flex gap-3">
                {/* Start Time */}
                <div className="flex-1">
                    <Dropdown
                        className="text-sm"
                        options={timeSlots}
                        value={startTime}
                        onChange={(e) => {
                            setValue("startTime", e.target.value, {
                                shouldValidate: true,
                                shouldDirty: true,
                            });

                            setValue("endTime", "", {
                                shouldValidate: true,
                            });
                        }}
                        placeholder="Start time"
                        error={errors.startTime?.message}
                    />
                </div>

                {/* End Time */}
                <div className="flex-1">
                    <Dropdown
                        className="text-sm"
                        options={endTimeOptions}
                        value={endTime}
                        onChange={(e) =>
                            setValue("endTime", e.target.value, {
                                shouldValidate: true,
                                shouldDirty: true,
                            })
                        }
                        placeholder="End time"
                        error={errors.endTime?.message}
                    />
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 mt-3">
                <Button
                    type="button"
                    className="flex-1 text-sm"
                    variant="primary"
                    onClick={handleSubmit(onSubmit)}
                >
                    Add Schedule
                </Button>

                <Button
                    type="button"
                    className="flex-1 text-sm"
                    variant="outline"
                    onClick={onClose}
                >
                    Close
                </Button>
            </div>
        </div>
    );
}