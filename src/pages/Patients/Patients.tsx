import { Search } from "lucide-react";
import Textfield from "../../components/ui/Textfield";
import { useMemo, useState } from "react";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useDebounce } from "../../hooks/useDebouce";
import useGetPatients from "../../hooks/patient/use-get-patients.hook";
import CustomizedTable from "../../components/ui/Table";
import type { Patient } from "../../types/patient.type";
import { formatDate } from "../../utils/utils";

const columns : ColumnDef<Patient>[] = [
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
        header: "Registered At",
        accessorKey: "createdAt",
        cell: info => formatDate(info.getValue() as string)
    }
]

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