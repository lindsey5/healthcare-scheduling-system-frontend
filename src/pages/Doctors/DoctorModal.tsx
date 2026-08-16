import { useForm } from "react-hook-form";
import useCreateDoctor from "../../hooks/doctor/use-create-doctor.hook";
import useUpdateDoctor from "../../hooks/doctor/use-update-doctor.hook";
import type { Doctor } from "../../types/doctor.type";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import { doctorSchema, type DoctorFormData } from "../../schemas/doctorSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { promiseToast } from "../../utils/utils";
import Textfield from "../../components/ui/Textfield";
import Button from "../../components/ui/Button";
import { useEffect, useState } from "react";
import { type Service } from "../../types/service.type";
import { Plus, X } from "lucide-react";
import AddService from "./AddService";

interface DoctorModalProps {
    show: boolean;
    doctor?: Doctor;
    close: () => void;
}

export default function DoctorModal ({
    close,
    show,
    doctor
} : DoctorModalProps) {
    const createDoctorMutation = useCreateDoctor();
    const updateDoctorMutation = useUpdateDoctor();

    const [assignedServices, setAssignedServices] = useState<Service[]>([]);
    const [showAddService, setShowAddService] = useState(false);

    const { 
        formState: { errors }, 
        handleSubmit, 
        reset,
        register,
        watch,
        setValue,
        getValues
    } = useForm<DoctorFormData>({
        resolver: zodResolver(doctorSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            doctorServices: []
        }
    })

    const onSubmit = (data : DoctorFormData) => {
        const isConfirm = confirm(`Are you sure you want to ${doctor ? 'update' : 'create'} this doctor?`);
        
        if(!isConfirm) return;

        promiseToast(doctor ? updateDoctorMutation.mutateAsync({ data, id: doctor.id}) : createDoctorMutation.mutateAsync(data))
    }

    const handleRemoveService = (id: number) => {
        const updated = getValues("doctorServices").filter(
            serviceId => serviceId !== id
        );

        setAssignedServices(prev =>
            prev.filter(service => service.id !== id)
        );

        setValue("doctorServices", updated);
    };

    const handleAddService = (service : Service | null) => {
        if(!service) return;

        const isExisting = getValues("doctorServices").find(serviceId => serviceId === service.id);

        if (isExisting) {
            alert("This service has already been added.");
            return;
        }

        const newValues = [...getValues("doctorServices"), service.id];

        setAssignedServices(prev => [...prev, service]);

        setValue("doctorServices", newValues);
        setShowAddService(false);
    }

    useEffect(() => {
        if(doctor){
            reset({
                firstname: doctor.firstname,
                lastname: doctor.lastname,
                doctorServices: doctor.doctorServices.map(service => service.service.id)
            });
            setAssignedServices(doctor.doctorServices.map(service => service.service))
        }else {
            reset({
                firstname: "",
                lastname: "",
                doctorServices: []
            });
            setAssignedServices([]);
        }
    }, [doctor, show, reset])


    return (
        <Modal
            onClose={close}
            open={show}
        >
            <AddService 
                close={() => setShowAddService(false)} 
                show={showAddService}
                handleAdd={handleAddService}
                doctorServices={watch('doctorServices')}
            />
            <Card className="space-y-5">
                <h1 className="text-xl font-bold text-[#1E3D15]">
                    {doctor ? 'Edit' : 'Create'} Doctor
                </h1>
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <Textfield 
                        label="First Name"
                        registration={register("firstname")}
                        placeholder="Enter first name"
                        error={errors.firstname?.message}
                    />
                    <Textfield 
                        label="Last Name"
                        registration={register("lastname")}
                        placeholder="Enter last name"
                        error={errors.lastname?.message}
                    />
                    <div className="space-y-3">
                        <h2 className="text-sm font-medium text-gray-700">Assigned Services</h2>
                        {!watch('doctorServices').length ? (
                            <p className="text-sm text-gray-500">No assigned services yet</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {assignedServices.map(service => (
                                    <div key={service.id} className="flex items-center gap-3 border px-2 py-1 border-gray-500 rounded-md">
                                        <h2 className="text-sm">{service.serviceName}</h2>
                                        <button 
                                            type="button"
                                            className="cursor-pointer" 
                                            onClick={() => handleRemoveService(service.id)}
                                        >
                                            <X size={15}/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            className="flex gap-1 items-center text-sm bg-green-100 border border-green-800 px-2 py-1 rounded-md cursor-pointer"
                            type="button"
                            onClick={() => setShowAddService(true)}
                        >
                            <Plus size={16}/>
                            Add Service
                        </button>
                        {errors.doctorServices?.message && <p className="text-sm text-red-500">{errors.doctorServices.message}</p>}
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={updateDoctorMutation.isPending || createDoctorMutation.isPending}>
                            {doctor ? "Save Changes" : "Create Doctor"}
                        </Button>
                    </div>
                </form>
            </Card>
        </Modal>
    )
}