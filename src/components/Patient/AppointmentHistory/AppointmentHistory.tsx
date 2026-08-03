import type { ColumnDef, PaginationState } from "@tanstack/react-table"
import type { Appointment } from "../../../types/appointment.type"
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useDebounce } from "../../../hooks/useDebouce";
import useGetMyAppointments from "../../../hooks/appointment/use-get-my-appointments.hook";
import CustomizedTable from "../../ui/Table";
import { formatDate, formatTime, getKeyByValue } from "../../../utils/utils";
import AppointmentStatusChip from "../../ui/StatusChip";
import Textfield from "../../ui/Textfield";
import { Eye, Search } from "lucide-react";
import Dropdown from "../../ui/Dropdown";
import { STATUS } from "../../../lib/contants/constants";
import AppointmentModal from "./AppointmentModal";
import type { SortOption } from "../../../types/types";

const options: Record<string, SortOption> = {
    'Date Submitted - DESC': { sort: 'createdAt', order: 'desc' },
    'Date Submitted - ASC': { sort: 'createdAt', order: 'asc' },
    'Appointment Date - ASC' : { sort: 'appointmentDate', order: 'asc' },
    'Appointment Date - DESC' : { sort: 'appointmentDate', order: 'desc' },
};

const columns = (setAppointment : Dispatch<SetStateAction<Appointment | undefined>>) : ColumnDef<Appointment>[] => [
    {
        header: "Reference Number",
        accessorKey: "referenceNumber",
    },
    {
        header: "Service",
        cell:  ({ row }) => row.original.service.serviceName
    },
    {
        header: "Doctor",
        cell:  ({ row }) => `Dr. ${row.original.doctor.firstname} ${row.original.doctor.lastname}`
    },
    {
        header: "Date",
        accessorKey: "appointmentDate",
    },
    {
        header: "Time",
        accessorKey: "appointmentTime",
        cell: info => formatTime(info.getValue() as string)
    },
    {
        header: "Status",
        cell: ({ row }) => <AppointmentStatusChip status={row.original.status} />
    },
    {
        header: "Date Submitted",
        accessorKey: "createdAt",
        cell: info => formatDate(info.getValue() as string)
    },
    {   
        header: "Action",
        cell: ({ row }) => (
            <div className="flex justify-center">
                <button
                    className="cursor-pointer hover:text-green-300"
                    onClick={() => setAppointment(row.original)}
                >
                    <Eye size={18}/>
                </button>
            </div>
        ),
        meta: { align: 'center' }
    }
]

export default function AppointmentHistory () {
    const [showModal, setShowModal] = useState(false);
    const [appointment, setAppointment] = useState<Appointment>();

    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);

    const [sort, setSort] = useState<SortOption>({ sort: 'createdAt', order: 'desc' });

    const [status, setStatus] = useState("");

    const params = useMemo(() => ({
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        search: debouncedSearch,
        status,
        sort: sort.sort,
        order: sort.order,
    }), [
        pagination.pageSize,
        pagination.pageIndex,
        debouncedSearch,
        status,
        sort
    ])

    const debouncedParams = useDebounce(params);
    const { data, isFetching } = useGetMyAppointments(debouncedParams);

    return (
        <div className="p-6 space-y-5 overflow-auto">
            <AppointmentModal 
                close={() => {
                    setShowModal(false);
                    setAppointment(undefined);
                }}
                show={showModal}
                appointment={appointment}
            />
            
            <div className="w-full flex justify-between items-end gap-3">
                <div className="space-y-5">
                    <h1 className="text-3xl font-bold text-[#1E3D15]">
                        Appointment History
                    </h1>
                    <Textfield 
                        className="text-sm w-100 bg-white"
                        icon={<Search size={18}/>}
                        placeholder="Search by Reference Number, Doctor, Service..."
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                        }}
                    />
                </div>
                <div className="flex gap-3">
                    <Dropdown 
                        className="text-sm"
                        placeholder="Filter by status"
                        label="Filter"
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                        }}
                        options={[
                            { label: "All", value: "" },
                            ...STATUS.map(status => ({ label: status, value: status }))
                        ]}
                    />

                    <Dropdown 
                        className="text-sm"
                        label="Sort"
                        options={Object.keys(options).map(opt => ({ label: opt, value: opt }))}
                        onChange={(e) =>{ 
                            setPagination(prev => ({ ...prev, pageIndex: 0 }))
                            setSort(options[e.target.value])
                        }}
                        value={getKeyByValue(options, sort) || ""}
                    />
                </div>
            </div>
            <CustomizedTable 
                isLoading={isFetching}
                data={data?.appointments || []}
                pagination={pagination}
                setPagination={setPagination}
                columns={columns(setAppointment)}
                totalPages={data?.totalPages || 0}
                showPagination
                noDataMessage="No Appointments Found"
                total={data?.total || 0}
                onRowClick={(row) => {
                    setAppointment(row);
                    setShowModal(true)
                }}
            />
        </div>
    )
}