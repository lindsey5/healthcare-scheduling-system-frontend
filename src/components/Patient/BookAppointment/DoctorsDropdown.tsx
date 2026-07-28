import useGetDoctors from "../../../hooks/doctor/use-get-doctors.hook";
import Dropdown from "../../ui/Dropdown";

interface DoctorsDropdownProps {
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
    serviceId?: number;
    disabled?: boolean;
    value?: number;
}

export default function DoctorsDropdown ({ 
    onChange,
    error,
    serviceId,
    disabled,
    value
} : DoctorsDropdownProps) {
    const { data } = useGetDoctors({ serviceId });

    return (
        <Dropdown 
            onChange={onChange}
            error={error}
            value={value}
            label="Assigned Doctor *"
            placeholder="Select Doctor"
            disabled={disabled}
            options={data?.doctors.map(doctor => ({ label: `Dr. ${doctor.firstname} ${doctor.lastname}`, value: doctor.id })) || []}
        />
    )
}