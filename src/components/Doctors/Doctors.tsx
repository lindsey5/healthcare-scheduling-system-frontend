import { useState } from "react";
import useGetDoctors from "../../hooks/doctor/use-get-doctors.hook"
import { useDebounce } from "../../hooks/useDebouce";
import Textfield from "../ui/Textfield";
import { CalendarDays, Pencil, Search, Trash2 } from "lucide-react";
import type { Doctor } from "../../types/doctor.type";
import type { ColumnDef } from "@tanstack/react-table";
import CustomizedTable from "../ui/Table";
import Button from "../ui/Button";
import DoctorModal from "./DoctorModal";
import useDeleteDoctor from "../../hooks/doctor/use-delete-doctor.hook";
import { promiseToast } from "../../utils/utils";
import { useAuthStore } from "../../lib/store/authStore";

const columns = ({
    handleDelete,
    handleEdit,
} : { 
    handleEdit: (row : Doctor) => void;
    handleDelete: (id: number) => void;
}) : ColumnDef<Doctor>[] => {
    const { user } = useAuthStore();
    
    return [
    {
        header: "Name",
        cell: ({ row }) => `Dr. ${row.original.firstname} ${row.original.lastname}`
    },
    {
        header: "Assigned Services",
        cell: ({ row }) => row.original.doctorServices.length
    },
    {
        header: "Action",
        meta: { align: "center" },
        cell: ({ row }) => (
            <div className="flex items-center justify-center gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/${user.role}/appointments?q=${row.original.firstname} ${row.original.lastname}`
                    }}
                    className="cursor-pointer rounded-md p-2 text-blue-600 hover:bg-blue-100 transition-colors"
                    title="View Appointments"
                >
                    <CalendarDays size={18} />
                </button>
                <button
                    onClick={() => handleEdit(row.original)}
                    className="cursor-pointer p-2 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-600 transition"
                    title="Edit"
                >
                    <Pencil size={18} />
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(row.original.id);
                    }}
                    className="cursor-pointer rounded-md p-2 text-red-600 hover:bg-red-100 transition-colors"
                    title="Delete"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        ),
    }
]
}

export default function Doctors () {
    const deleteDoctorMutation = useDeleteDoctor();
    const [showModal, setShowModal] = useState(false);
    const [doctor, setDoctor] = useState<Doctor>();

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);

    const { data, isFetching } = useGetDoctors({ search: debouncedSearch });

    const handleEdit = (row : Doctor) => {
        setShowModal(true);
        setDoctor(row);
    }

    const handleDelete = (id : number) => {
        const isConfirm = confirm("Are you sure you want to delete this doctor?");

        if(!isConfirm) return;

        promiseToast(deleteDoctorMutation.mutateAsync(id));
    }

    const handleClose = () => {
        setShowModal(false);
        setDoctor(undefined);
    }

    return (
        <div className="p-6 space-y-5 overflow-auto">
            <DoctorModal 
                close={handleClose}
                show={showModal}
                doctor={doctor}
            />
            <h1 className="text-3xl font-bold text-[#1E3D15]">
                Doctors
            </h1>
            <div className="w-full flex justify-between ">
                <Textfield 
                    className="text-sm w-100 bg-white"
                    icon={<Search size={18}/>}
                    placeholder="Search by first name or last name"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                    onClick={() => setShowModal(true)}
                >Create Doctor</Button>
            </div>
            <CustomizedTable 
                isLoading={isFetching}
                data={data?.doctors || []}
                columns={columns({ handleDelete, handleEdit })}
                showPagination={false}
                noDataMessage="No Appointments Found"
                onRowClick={(row) => {
                    setDoctor(row);
                    setShowModal(true)
                }}
            />
        </div>
    )
}