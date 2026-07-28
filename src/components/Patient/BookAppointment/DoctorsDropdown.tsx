import type { Dispatch, SetStateAction } from "react";
import useGetDoctors from "../../../hooks/doctor/use-get-doctors.hook";
import Dropdown from "../../ui/Dropdown";
import type { Doctor } from "../../../types/doctor.type";

interface DoctorsDropdownProps {
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
    serviceId?: number;
    disabled?: boolean;
    value?: number;
    setSelectedDoctor?: Dispatch<SetStateAction<Doctor | null>>;
}

export default function DoctorsDropdown ({ 
    onChange,
    error,
    serviceId,
    disabled,
    value,
    setSelectedDoctor
} : DoctorsDropdownProps) {
    const { data } = useGetDoctors({ serviceId });

    return (
        <Dropdown 
            onChange={(e) => {
                onChange?.(e);
                setSelectedDoctor?.(data?.doctors.find(doctor => doctor.id === Number(e.target.value)) || null)
            }}
            error={error}
            value={value}
            label="Assigned Doctor *"
            placeholder="Select Doctor"
            disabled={disabled}
            options={data?.doctors.map(doctor => ({ label: `Dr. ${doctor.firstname} ${doctor.lastname}`, value: doctor.id })) || []}
        />
    )
}