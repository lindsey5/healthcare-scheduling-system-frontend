import { useState } from "react";
import useGetDoctors from "../../hooks/doctor/use-get-doctors.hook"
import { useDebounce } from "../../hooks/useDebouce";
import Textfield from "../ui/Textfield";
import { Pencil, Search, Trash2 } from "lucide-react";
import type { Doctor } from "../../types/doctor.type";
import type { ColumnDef } from "@tanstack/react-table";
import CustomizedTable from "../ui/Table";
import Button from "../ui/Button";
import DoctorModal from "./DoctorModal";

const columns = ({
    handleDelete,
    handleEdit,
} : { 
    handleEdit: (row : Doctor) => void;
    handleDelete: (id: number) => void;
}) : ColumnDef<Doctor>[] => [
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
                onClick={() => handleEdit(row.original)}
                className="cursor-pointer p-2 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-600 transition"
                title="Edit"
            >
                <Pencil size={18} />
            </button>

            <button
                onClick={() => handleDelete(row.original.id)}
                className="cursor-pointer rounded-md p-2 text-red-600 hover:bg-red-100 transition-colors"
                title="Delete"
            >
                <Trash2 size={18} />
            </button>
        </div>
    ),
    }
]

export default function Doctors () {
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

    }

    const handleClose = () => {
        setShowModal(false);
        setDoctor(undefined);
    }

    const handleCreate = () => setShowModal(true);

    return (
        <div className="p-6 flex-1 flex flex-col gap-10 max-h-screen overflow-auto">
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