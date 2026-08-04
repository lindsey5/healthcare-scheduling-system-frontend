import { Stethoscope } from "lucide-react";
import useGetServices from "../../hooks/service/use-get-services.hook";
import DashboardCard from "../ui/DashboardCard";

export default function AvailableServicesCard ({ onClick } : { onClick?: () => void }) {
    const { data } = useGetServices();

    return (
        <DashboardCard 
            title="Available Services"
            value={String(data?.services.length)}
            icon={<Stethoscope />}
            onClick={onClick}
        />
    )
}