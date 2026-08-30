import { Search } from "lucide-react";
import Textfield from "../../../components/ui/Textfield";
import { useMemo, useState } from "react";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useDebounce } from "../../../hooks/useDebouce";
import CustomizedTable from "../../../components/ui/Table";
import { formatDate } from "../../../utils/utils";
import useGetAudits from "../../../hooks/audit/use-get-audits.hook";
import type { Audit } from "../../../types/audit.type";
import { SeverityChip } from "../../../components/ui/SeverityChip";
import Dropdown from "../../../components/ui/Dropdown";

const columns : ColumnDef<Audit>[] = [
    {
        header: "User",
        cell: ({ row }) => {
            const firstname = row.original.userType === 'Admin' ? row.original.admin.firstname : row.original.staff.firstname;
            const lastname = row.original.userType === 'Admin' ? row.original.admin.lastname : row.original.staff.lastname;
            const email = row.original.userType === 'Admin' ? row.original.admin.email : row.original.staff.email;

            return (
                <div>
                    <h1 className="font-semibold">{`${firstname} ${lastname}`}</h1>
                    <p>{email}</p>
                </div>
            )
        }
    },
    {
        header: "User Type",
        accessorKey: "userType",
        meta: { align: 'center' }
    },
    {
        header: "Action",
        accessorKey: "action",
        meta: { align: 'center' }
    },
    {
        header: "Entity",
        accessorKey: "entity",
        meta: { align: 'center' }
    },
    {
        header: "Severity",
        accessorKey: "severity",
        meta: { align: 'center' },
        cell: ({ row }) => (
            <SeverityChip
                severity={row.original.severity}
            />
        ),
    },
    {
        header: "Date & Time",
        accessorKey: "createdAt",
        cell: info => formatDate(info.getValue() as string),
        meta: { align: 'center' },
    },
]

export default function Audits () {
    const [userType, setUserType] = useState("");
    const [severity, setSeverity] = useState("");
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);

    const params = useMemo(() => ({
        search: debouncedSearch,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        startDate, 
        endDate,
        severity,
        userType
    }), [
        debouncedSearch,
        pagination.pageSize,
        pagination.pageIndex,
        debouncedSearch,
        startDate,
        endDate,
        severity,
        userType
    ])

    const { data, isFetching } = useGetAudits(params)

    return (
        <div className="p-6 flex-1 flex flex-col gap-10 overflow-auto">
            <h1 className="text-3xl font-bold text-[#1E3D15]">
                Audit Logs
            </h1>
            <div className="w-full flex justify-between items-end flex-wrap gap-3">
                <Textfield 
                    className="text-sm w-100 bg-white"
                    icon={<Search size={18}/>}
                    placeholder="Search by user, action or entity..."
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="flex gap-3">
                    <Textfield 
                        label="From"
                        className="text-sm"
                        type="date"
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                        }}
                        value={startDate}
                    />
                    <Textfield 
                        label="To"
                        className="text-sm"
                        type="date"
                        onChange={(e) => {
                            setEndDate(e.target.value);
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                        }}
                        value={endDate}
                    />
                    <Dropdown 
                        className="text-sm"
                        label="User Type"
                        placeholder="Select user type"
                        onChange={(e) => {
                            setUserType(e.target.value);
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                        }}
                        options={[
                            { label: "All", value: "" },
                            { label: 'Admin', value: "Admin" },
                            { label: "Staff", value: "Staff" },
                        ]}
                        value={userType}
                    />
                    <Dropdown 
                        className="text-sm"
                        label="Severity"
                        placeholder="Select severity"
                        onChange={(e) => {
                            setSeverity(e.target.value);
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                        }}
                        options={[
                            { label: "All", value: "" },
                            { label: 'INFO', value: "INFO" },
                            { label: "WARNING", value: "WARNING" },
                            { label: "CRITICAL", value: "CRITICAL" },
                        ]}
                        value={severity}
                    />
                </div>
            </div>
            <CustomizedTable 
                isLoading={isFetching}
                data={data?.audits || []}
                columns={columns}
                pagination={pagination}
                setPagination={setPagination}
                totalPages={data?.totalPages || 0}
                total={data?.total || 0}
                showPagination
                noDataMessage="No Audit Logs Found"
            />
        </div>
    )
}