import { Pencil, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import Textfield from "../../ui/Textfield";
import CustomizedTable from "../../ui/Table";
import Button from "../../ui/Button";
import StaffModal from "./StaffModal";

import { useDebounce } from "../../../hooks/useDebouce";
import { formatDate, promiseToast } from "../../../utils/utils";

import useGetStaffs from "../../../hooks/staff/use-get-staffs.hook";
import useDeleteStaff from "../../../hooks/staff/use-delete-staff.hook";

import type { Staff } from "../../../types/staff.type";

const columns = ({
    handleEdit,
    handleDelete,
}: {
    handleDelete: (id: number) => void;
    handleEdit: (staff: Staff) => void;
}): ColumnDef<Staff>[] => [
    {
        header: "First Name",
        accessorKey: "firstname",
    },
    {
        header: "Last Name",
        accessorKey: "lastname",
    },
    {
        header: "Email",
        accessorKey: "email",
    },
    {
        header: "Date Created",
        accessorKey: "createdAt",
        cell: (info) => formatDate(info.getValue() as string),
    },
    {
        header: "Action",
        meta: { align: "center" },
        cell: ({ row }) => (
            <div className="flex items-center justify-center gap-2">
                <button
                    onClick={() => handleEdit(row.original)}
                    className="cursor-pointer rounded-lg p-2 text-gray-600 transition hover:bg-green-50 hover:text-green-600"
                    title="Edit"
                >
                    <Pencil size={18} />
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(row.original.id);
                    }}
                    className="cursor-pointer rounded-md p-2 text-red-600 transition-colors hover:bg-red-100"
                    title="Delete"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        ),
    },
];

export default function Staffs() {
    const deleteStaffMutation = useDeleteStaff();

    const [staff, setStaff] = useState<Staff | null>(null);
    const [showModal, setShowModal] = useState(false);

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);

    const params = useMemo(
        () => ({
            search: debouncedSearch,
        }),
        [debouncedSearch]
    );

    const { data, isFetching } = useGetStaffs(params);

    const handleEdit = (staff: Staff) => {
        setStaff(staff);
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        const isConfirm = confirm(
            "Are you sure you want to delete this staff?"
        );

        if (!isConfirm) return;

        promiseToast(deleteStaffMutation.mutateAsync(id));
    };

    const handleClose = () => {
        setShowModal(false);
        setStaff(null);
    };

    return (
        <div className="flex flex-1 flex-col gap-10 overflow-auto p-6">
            <StaffModal
                staff={staff}
                show={showModal}
                close={handleClose}
            />

            <h1 className="text-3xl font-bold text-[#1E3D15]">
                Staffs
            </h1>

            <div className="flex justify-between gap-5">
                <Textfield
                    className="w-100 bg-white text-sm"
                    icon={<Search size={18} />}
                    placeholder="Search by first name, last name or email..."
                    onChange={(e) => setSearch(e.target.value)}
                />

                <Button onClick={() => setShowModal(true)}>
                    Create Staff
                </Button>
            </div>

            <CustomizedTable
                isLoading={isFetching}
                data={data?.staffs || []}
                columns={columns({
                    handleDelete,
                    handleEdit,
                })}
                showPagination={false}
                noDataMessage="No Staff Found"
            />
        </div>
    );
}