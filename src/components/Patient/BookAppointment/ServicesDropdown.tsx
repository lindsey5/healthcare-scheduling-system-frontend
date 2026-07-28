import { type Dispatch, type SetStateAction } from "react";
import useGetServices from "../../../hooks/service/use-get-services.hook"
import Dropdown from "../../ui/Dropdown";
import type { Service } from "../../../types/service.type";

interface ServicesDropdownProps {
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
    disabled?: boolean;
    dayOfWeek?: string;
    value?: number;
    setSelectedService?: Dispatch<SetStateAction<Service | null>>;
}

export default function ServicesDropdown ({ 
    onChange,
    error,
    disabled,
    dayOfWeek,
    value,
    setSelectedService
} : ServicesDropdownProps) {
    const { data } = useGetServices(dayOfWeek);

    return (
        <Dropdown 
            onChange={(e) => {
                onChange?.(e);
                setSelectedService?.(data?.services.find(service => service.id === Number(e.target.value)) || null)
            }}
            error={error}
            label="Healthcare Service *"
            placeholder="Select Service"
            value={value}
            disabled={disabled}
            options={data?.services.map(service => ({ label: service.serviceName, value: service.id })) || []}
        />
    )
}