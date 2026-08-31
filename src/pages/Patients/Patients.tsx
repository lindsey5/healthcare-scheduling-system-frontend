import { Search } from "lucide-react";
import Textfield from "../../components/ui/Textfield";
import { useMemo, useState } from "react";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useDebounce } from "../../hooks/useDebouce";
import useGetPatients from "../../hooks/patient/use-get-patients.hook";
import CustomizedTable from "../../components/ui/Table";
import type { Patient } from "../../types/patient.type";
import { cn, formatDate, promiseToast } from "../../utils/utils";
import useActivatePatient from "../../hooks/patient-notification/use-activate-patient.hook";
import useDeactivatePatient from "../../hooks/patient-notification/use-deactivate-patient.hook";
import Button from "../../components/ui/Button";

export default function Patients () {
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });
    
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);

    const params = useMemo(() => ({
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        search: debouncedSearch,
    }), [
        pagination.pageSize,
        pagination.pageIndex,
        debouncedSearch,
    ])

    const { data, isFetching } = useGetPatients(params);

    const activateMutation = useActivatePatient();
    const deactivateMutation = useDeactivatePatient();

    const handleActivate = (id: number) => {
        const isConfirm = confirm(
            "Are you sure you want to activate this patient?"
        );

        if (!isConfirm) return;

        promiseToast(activateMutation.mutateAsync(id));
    };

    const handleDeactivate = (id: number) => {
        const isConfirm = confirm(
            "Are you sure you want to deactivate this patient?"
        );

        if (!isConfirm) return;

        promiseToast(deactivateMutation.mutateAsync(id));
    };

    const columns : ColumnDef<Patient>[] = useMemo(() => [
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
            header: "Status",
            accessorKey: "isActive",
            cell: info => {
                const isActive = info.getValue<boolean>();

                return (
                    <span
                        className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                            isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        )}
                    >
                        {isActive ? "Active" : "Deactivated"}
                    </span>
                );
            },
        },
        {
            header: "Registered At",
            accessorKey: "createdAt",
            cell: info => formatDate(info.getValue() as string)
        },
        {
            header: "Action",
            meta: { align: 'center' },
            cell: ({ row }) => {
                const patient = row.original;

                return (
                    <Button
                        variant={patient.isActive ? 'danger' : 'primary'}
                        onClick={() =>
                            patient.isActive
                                ? handleDeactivate(patient.id)
                                : handleActivate(patient.id)
                        }
                    >
                        {patient.isActive ? "Deactivate" : "Activate"}
                    </Button>
                );
            },
        },
    ], [])

    return (
        <div className="p-6 space-y-5 overflow-auto">
            <h1 className="text-3xl font-bold text-[#1E3D15]">
                Registered Patients
            </h1>
            <Textfield 
                className="text-sm w-100 bg-white"
                icon={<Search size={18}/>}
                placeholder="Search by first name, last name or email..."
                onChange={(e) => setSearch(e.target.value)}
            />
            <CustomizedTable 
                isLoading={isFetching}
                data={data?.patients || []}
                pagination={pagination}
                setPagination={setPagination}
                columns={columns}
                totalPages={data?.totalPages || 0}
                showPagination
                noDataMessage="No Patients Found"
                total={data?.total || 0}
            />
        </div>
    )
}