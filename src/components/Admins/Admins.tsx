import { Pencil, Search, Trash2 } from "lucide-react";
import Textfield from "../ui/Textfield";
import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useDebounce } from "../../hooks/useDebouce";
import CustomizedTable from "../ui/Table";
import { formatDate, promiseToast } from "../../utils/utils";
import useGetAdmins from "../../hooks/admin/use-get-admins.hook";
import type { Admin } from "../../types/admin.type";
import AdminModal from "./AdminModal";
import Button from "../ui/Button";
import useDeleteAdmin from "../../hooks/admin/use-delete-admin.hook";

const columns  = ({ 
    handleEdit,
    handleDelete,
} : {
    handleDelete: (id: number) => void;
    handleEdit: (admin : Admin) => void;
 }) : ColumnDef<Admin>[] => [
    {
        header: "First Name",
        accessorKey: "firstname",
    },
    {
        header: "Last Name",
        accessorKey: "lastname"
    },
    {
        header: "Email",
        accessorKey: "email"
    },
    {
        header: "Date Created",
        accessorKey: "createdAt",
        cell: info => formatDate(info.getValue() as string)
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

export default function Admins () {
    const deleteAdminMutation = useDeleteAdmin();

    const [admin, setAdmin] = useState<Admin | null>(null);
    const [showModal, setShowModal] = useState(false);

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);

    const params = useMemo(() => ({
        search: debouncedSearch,
    }), [
        debouncedSearch,
    ])

    const { data, isFetching } = useGetAdmins(params);

    const handleEdit = (admin : Admin) => {
        setAdmin(admin);
        setShowModal(true)
    }

    const handleDelete = (id : number) => {
        const isConfirm = confirm('Are you sure you want to delete this admin?');

        if(!isConfirm) return;

        promiseToast(deleteAdminMutation.mutateAsync(id));
    }

    const handleClose = () => {
        setShowModal(false);
        setAdmin(null);
    }

    return (
        <div className="p-6 flex-1 flex flex-col gap-10 overflow-auto">
            <AdminModal 
                admin={admin}
                close={handleClose}
                show={showModal}
            />
            <h1 className="text-3xl font-bold text-[#1E3D15]">
                Admins
            </h1>
            <div className="flex justify-between gap-5">
                <Textfield 
                    className="text-sm w-100 bg-white"
                    icon={<Search size={18}/>}
                    placeholder="Search by first name, last name or email..."
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={() => setShowModal(true)}>Create Admin</Button>
            </div>
            <CustomizedTable 
                isLoading={isFetching}
                data={data?.admins || []}
                columns={columns({ handleDelete, handleEdit })}
                showPagination={false}
                noDataMessage="No Admins Found"
            />
        </div>
    )
}