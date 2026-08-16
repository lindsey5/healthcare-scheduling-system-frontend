import Chart, { ChartSkeleton } from "../../components/ui/Chart";
import useGetMonthlyAppointments from "../../hooks/appointment/use-get-monthly-appointments.hook";

export default function MonthlyAppointments () {
    const { data, isFetching } = useGetMonthlyAppointments({});

    if(isFetching) return <ChartSkeleton />

    return (
        <div className="relative">
            <Chart 
                formatToPeso
                labels={data?.monthlyAppointments.map(app => app.month) || []}
                title="Monthly Appointments"
                values={data?.monthlyAppointments.map(app => app.totalAppointments) || []}
            />
        </div>
    )
}