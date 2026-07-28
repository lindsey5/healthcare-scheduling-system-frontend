import useGetServices from "../../../hooks/service/use-get-services.hook"
import Dropdown from "../../ui/Dropdown";

interface ServicesDropdownProps {
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
    disabled?: boolean;
    dayOfWeek?: string;
    value?: number;
}

export default function ServicesDropdown ({ 
    onChange,
    error,
    disabled,
    dayOfWeek,
    value
} : ServicesDropdownProps) {
    const { data } = useGetServices(dayOfWeek);

    return (
        <Dropdown 
            onChange={onChange}
            error={error}
            label="Healthcare Service *"
            placeholder="Select Service"
            value={value}
            disabled={disabled}
            options={data?.services.map(service => ({ label: service.serviceName, value: service.id })) || []}
        />
    )
}