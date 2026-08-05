
import type { ColumnDef, PaginationState } from "@tanstack/react-table"
import { type Appointment } from "../../types/appointment.type";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useDebounce } from "../../hooks/useDebouce";
import useGetAppointments from "../../hooks/appointment/use-get-appointments.hook";
import CustomizedTable from "../ui/Table";
import { formatTime } from "../../utils/utils";
import AppointmentStatusChip from "../ui/StatusChip";
import Textfield from "../ui/Textfield";
import Dropdown from "../ui/Dropdown";
import { STATUS } from "../../lib/contants/constants";
import AppointmentModal from "./AppointmentModal";
import { Eye, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const columns = (setAppointment : Dispatch<SetStateAction<Appointment | undefined>>) : ColumnDef<Appointment>[] => [
    {
        header: "Reference Number",
        accessorKey: "referenceNumber",
    },
    {
        header: 'Booked By',
        cell: ({ row }) => (
            <div>
                <h1 className="font-semibold">{`${row.original.patient.firstname} ${row.original.patient.lastname}`}</h1>
                <p>{row.original.patient.email}</p>
            </div>
        )
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
        header: "Status",
        cell: ({ row }) => <AppointmentStatusChip status={row.original.status} />
    },
    {
        header: "Appointment Date",
        accessorKey: "appointmentDate",
    },
    {
        header: "Appointment Time",
        accessorKey: "appointmentTime",
        cell: info => formatTime(info.getValue() as string)
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

export default function Appointments () {
    const [searchParams] = useSearchParams();
    const s = searchParams.get("s");
    const sd = searchParams.get("sd");
    const ed = searchParams.get("ed");
    const q = searchParams.get("q");

    const [showModal, setShowModal] = useState(false);
    const [appointment, setAppointment] = useState<Appointment>();

    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });

    const [search, setSearch] = useState(q || "");
    const debouncedSearch = useDebounce(search);

    const [startDate, setStartDate] = useState(sd || "");
    const [endDate, setEndDate] = useState(ed || "");

    const [status, setStatus] = useState(s || "");

    const params = useMemo(() => ({
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        search: debouncedSearch,
        status,
        startDate,
        endDate,
        sort: "createdAt"
    }), [
        pagination.pageSize,
        pagination.pageIndex,
        debouncedSearch,
        status,
        startDate,
        endDate,
    ])

    const debouncedParams = useDebounce(params);
    const { data, isFetching } = useGetAppointments(debouncedParams);

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
            
            <div className="w-full space-y-5">
                <h1 className="text-3xl font-bold text-[#1E3D15]">
                    Appointments
                </h1>
                <div className="w-full flex justify-between items-end flex-wrap gap-3">
                    <Textfield 
                        className="text-sm w-130 bg-white"
                        icon={<Search size={18}/>}
                        placeholder="Search by reference number., booked by, service, doctor..."
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                        }}
                        value={search}
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
                            label="Filter"
                            placeholder="Filter by status"
                            onChange={(e) => {
                                setStatus(e.target.value);
                                setPagination(prev => ({ ...prev, pageIndex: 0 }));
                            }}
                            options={[
                                { label: "All", value: "" },
                                ...STATUS.map(status => ({ label: status, value: status }))
                            ]}
                            value={status}
                        />
                    </div>
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