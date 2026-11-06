import { useState } from "react";
import useGetgetAvailableTimeSlot from "../../hooks/appointment/use-get-available-time-slot.hook";
import { formatTime } from "../../utils/utils";
import Dropdown from "../ui/Dropdown";

interface AvailableTimeSlotDropdownProps {
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
    disabled?: boolean;
    appointmentDate?: string;
    value?: string;
    serviceId: number;
    doctorId: number;
    label?: string;
    onPeriodChange?: () => void;
}

export default function AvailableTimeSlotDropdown ({ 
    onChange,
    error,
    disabled,
    appointmentDate,
    serviceId,
    doctorId,
    value,
    label,
    onPeriodChange,
} : AvailableTimeSlotDropdownProps) {
    const [periodSelection, setPeriodSelection] = useState<{
        selectionKey: string;
        period: "morning" | "afternoon";
    } | null>(null);
    const selectionKey = `${appointmentDate ?? ""}:${serviceId}:${doctorId}`;
    const period =
        periodSelection?.selectionKey === selectionKey
            ? periodSelection.period
            : "";
    const requestParams = {
        appointmentDate: appointmentDate ?? "",
        serviceId,
        doctorId,
    };
    const { data: morningData, isLoading: isMorningLoading } =
        useGetgetAvailableTimeSlot({
            ...requestParams,
            period: "morning",
        });
    const { data: afternoonData, isLoading: isAfternoonLoading } =
        useGetgetAvailableTimeSlot({
            ...requestParams,
            period: "afternoon",
        });
    const periodData =
        period === "morning"
            ? morningData
            : period === "afternoon"
                ? afternoonData
                : undefined;
    const availableTimeCount = periodData?.availableTimes.length ?? 0;
    const isPeriodLoading =
        period === "morning"
            ? isMorningLoading
            : period === "afternoon"
                ? isAfternoonLoading
                : false;

    if(!appointmentDate || !serviceId || !doctorId) {
        return (
            <Dropdown 
                label={label || "Available Time Slot *"}
                options={[]}
                error={error}
                disabled
            />
        )
    };

    return (
        <div className="flex-1 space-y-3">
            <Dropdown
                label="Time of Day *"
                value={period}
                placeholder="Select morning or afternoon"
                onChange={(event) => {
                    setPeriodSelection({
                        selectionKey,
                        period: event.target.value as "morning" | "afternoon",
                    });
                    onPeriodChange?.();
                }}
                disabled={
                    disabled ||
                    !appointmentDate ||
                    !serviceId ||
                    !doctorId
                }
                options={[
                    {
                        label: isMorningLoading
                            ? "Morning (checking availability...)"
                            : `Morning (${morningData?.availableTimes.length ?? 0} available)`,
                        value: "morning",
                    },
                    {
                        label: isAfternoonLoading
                            ? "Afternoon (checking availability...)"
                            : `Afternoon (${afternoonData?.availableTimes.length ?? 0} available)`,
                        value: "afternoon",
                    },
                ]}
            />
            {period && (
                <>
                    <p className="text-sm text-gray-600" aria-live="polite">
                        {isPeriodLoading
                            ? "Checking available times..."
                            : `${availableTimeCount} ${
                                period === "morning" ? "morning" : "afternoon"
                            } ${availableTimeCount === 1 ? "time" : "times"} available`}
                    </p>
                    <Dropdown
                        onChange={onChange}
                        error={error}
                        label={label || "Available Time Slot"}
                        placeholder="Select Time Slot"
                        value={value}
                        disabled={disabled || isPeriodLoading}
                        options={periodData?.availableTimes.map((time) => ({
                            label: formatTime(time),
                            value: time,
                        })) || []}
                    />
                </>
            )}
        </div>
    )
}