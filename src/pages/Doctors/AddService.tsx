import { useState } from "react";
import useGetServices from "../../hooks/service/use-get-services.hook";
import type { Service } from "../../types/service.type";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Dropdown from "../../components/ui/Dropdown";
import Modal from "../../components/ui/Modal";

interface AddServiceProps {
    show: boolean;
    close: () => void;
    handleAdd: (service : Service | null) => void;
    doctorServices: number[];
}

export default function AddService ({
    show,
    handleAdd,
    close,
    doctorServices
} : AddServiceProps) {
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    const { data } = useGetServices();

    return (
        <Modal
            onClose={close}
            open={show}
        >
            <Card className="space-y-5 max-h-[80%] overflow-auto">
                <h1 className="text-xl font-bold text-[#1E3D15]">
                    Add Service
                </h1>
                <Dropdown 
                    className="text-sm"
                    label="Select Service"
                    options={data?.services
                        .filter(service => !doctorServices.includes(service.id))
                        .sort((a, b) => a.serviceName.localeCompare(b.serviceName))
                        .map(service => ({ label: service.serviceName, value: service.id })) || []
                    }
                    onChange={(e) => setSelectedService(data?.services.find(service => service.id === Number(e.target.value)) || null)}
                />
                <Button
                    className="text-sm px-4 py-2"
                    onClick={() => handleAdd(selectedService)}
                    disabled={!selectedService}
                >Add Service</Button>
            </Card>

        </Modal>
    )
}