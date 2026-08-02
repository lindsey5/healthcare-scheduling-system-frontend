import useGetgetAvailableTimeSlot from "../../../hooks/appointment/use-get-available-time-slot.hook";
import { formatTime } from "../../../utils/utils";
import Dropdown from "../../ui/Dropdown";

interface AvailableTimeSlotDropdownProps {
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
    disabled?: boolean;
    appointmentDate?: string;
    value?: string;
    serviceId: number;
}

export default function AvailableTimeSlotDropdown ({ 
    onChange,
    error,
    disabled,
    appointmentDate,
    serviceId,
    value
} : AvailableTimeSlotDropdownProps) {
    if(!appointmentDate) {
        return (
            <Dropdown 
                label="Available Time Slot *"
                options={[]}
                error={error}
                disabled
            />
        )
    };

    const { data } = useGetgetAvailableTimeSlot({ appointmentDate, serviceId });

    return (
        <Dropdown 
            onChange={onChange}
            error={error}
            label="Available Time Slot"
            placeholder="Select Time Slot"
            value={value}
            disabled={disabled}
            options={data?.availableTimes.map(time => ({ label: `${formatTime(time)}`, value: time })) || []}
        />
    )
}