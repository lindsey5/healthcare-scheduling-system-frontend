import type { ColumnDef, PaginationState } from "@tanstack/react-table"
import type { Appointment } from "../../../types/appointment.type"
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useDebounce } from "../../../hooks/useDebouce";
import useGetMyAppointments from "../../../hooks/appointment/use-get-my-appointments.hook";
import CustomizedTable from "../../ui/Table";
import { formatDate, formatTime } from "../../../utils/utils";
import AppointmentStatusChip from "../../ui/StatusChip";
import Textfield from "../../ui/Textfield";
import { Eye, Search } from "lucide-react";
import Dropdown from "../../ui/Dropdown";
import { STATUS } from "../../../lib/contants/constants";
import AppointmentModal from "./AppointmentModal";

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

    const [status, setStatus] = useState("");

    const params = useMemo(() => ({
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        search: debouncedSearch,
        status
    }), [
        pagination.pageSize,
        pagination.pageIndex,
        debouncedSearch,
        status
    ])

    const debouncedParams = useDebounce(params);
    const { data, isFetching } = useGetMyAppointments(debouncedParams);

    return (
        <div className="p-6 flex-1 flex flex-col gap-10 max-h-screen overflow-auto">
            <AppointmentModal 
                close={() => {
                    setShowModal(false);
                    setAppointment(undefined);
                }}
                show={showModal}
                appointment={appointment}
            />
            
            <div className="w-full space-y-5">
                <h1 className="text-3xl font-bold text-[#1E3D15]">
                    Appointment History
                </h1>
                <div className="w-full flex justify-between ">
                    <Textfield 
                        className="text-sm w-100 bg-white"
                        icon={<Search size={18}/>}
                        placeholder="Search by Reference Number"
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                        }}
                    />
                    <Dropdown 
                        className="text-sm"
                        placeholder="Filter by status"
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                        }}
                        options={[
                            { label: "All", value: "" },
                            ...STATUS.map(status => ({ label: status, value: status }))
                        ]}
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