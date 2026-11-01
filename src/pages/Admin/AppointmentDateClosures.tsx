import { useState, type FormEvent } from "react";
import { CalendarOff, RotateCcw } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Textfield from "../../components/ui/Textfield";
import {
    useAppointmentDateClosures,
    useCreateAppointmentDateClosure,
    useDeleteAppointmentDateClosure,
} from "../../hooks/appointment/use-appointment-date-closures.hook";
import { formatTime, promiseToast } from "../../utils/utils";
import { format } from "date-fns";

const parse12HourTime = (time: string) => {
    const match = /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i.exec(
        time.trim()
    );

    if (!match) {
        return null;
    }

    const hours =
        (Number(match[1]) % 12) + (match[3].toUpperCase() === "PM" ? 12 : 0);

    return `${String(hours).padStart(2, "0")}:${match[2]}`;
};

export default function AppointmentDateClosures() {
    const [closureDate, setClosureDate] = useState("");
    const [reason, setReason] = useState("");
    const [isFullDay, setIsFullDay] = useState(true);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const {
        data,
        isLoading,
        isError,
        error,
    } = useAppointmentDateClosures();
    const createClosure = useCreateAppointmentDateClosure();
    const deleteClosure = useDeleteAppointmentDateClosure();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const normalizedStartTime = isFullDay
            ? null
            : parse12HourTime(startTime);
        const normalizedEndTime = isFullDay
            ? null
            : parse12HourTime(endTime);

        if (
            !isFullDay &&
            (!normalizedStartTime ||
                !normalizedEndTime ||
                normalizedStartTime >= normalizedEndTime)
        ) {
            return;
        }

        promiseToast(
            createClosure.mutateAsync({
                closureDate,
                startTime: normalizedStartTime,
                endTime: normalizedEndTime,
                reason,
            }),
            "top-center",
            () => {
                setClosureDate("");
                setReason("");
                setIsFullDay(true);
                setStartTime("");
                setEndTime("");
            }
        );
    };

    const handleReopen = (id: number) => {
        if (!confirm("Reopen this date for new appointments?")) {
            return;
        }

        promiseToast(deleteClosure.mutateAsync(id), "top-center", () => {});
    };

    return (
        <div className="flex min-h-screen flex-1 flex-col gap-6 overflow-auto p-6">
            <div>
                <h1 className="text-3xl font-bold text-[#1E3D15]">
                    Closed Appointment Dates
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    Patients cannot create or reschedule appointments to a
                    closed date. Existing appointments will remain unchanged.
                </p>
            </div>

            <Card className="space-y-5">
                <h2 className="text-xl font-semibold text-[#1E3D15]">
                    Close a date
                </h2>
                <form
                    className="space-y-4"
                    onSubmit={handleSubmit}
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <Textfield
                            label="Date"
                            type="date"
                            value={closureDate}
                            onChange={(event) =>
                                setClosureDate(event.target.value)
                            }
                            required
                        />
                        <Textfield
                            label="Reason (optional)"
                            value={reason}
                            onChange={(event) =>
                                setReason(event.target.value)
                            }
                            placeholder="e.g. Public holiday"
                            maxLength={255}
                        />
                    </div>

                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <input
                            type="checkbox"
                            checked={isFullDay}
                            onChange={(event) =>
                                setIsFullDay(event.target.checked)
                            }
                            className="h-4 w-4 accent-[#1E3D15]"
                        />
                        Close for 24 hours
                    </label>

                    {!isFullDay && (
                        <div className="grid gap-4 md:grid-cols-2">
                            <Textfield
                                label="From"
                                type="text"
                                value={startTime}
                                onChange={(event) =>
                                    setStartTime(event.target.value.toUpperCase())
                                }
                                placeholder="e.g. 09:30 AM"
                                pattern="(0?[1-9]|1[0-2]):[0-5][0-9] ?(AM|PM)"
                                title="Enter time in 12-hour format, such as 09:30 AM."
                                required
                            />
                            <Textfield
                                label="To"
                                type="text"
                                value={endTime}
                                onChange={(event) =>
                                    setEndTime(event.target.value.toUpperCase())
                                }
                                placeholder="e.g. 01:00 PM"
                                pattern="(0?[1-9]|1[0-2]):[0-5][0-9] ?(AM|PM)"
                                title="Enter time in 12-hour format, such as 01:00 PM."
                                required
                            />
                            {startTime &&
                                endTime &&
                                (!parse12HourTime(startTime) ||
                                    !parse12HourTime(endTime) ||
                                    parse12HourTime(startTime)! >=
                                        parse12HourTime(endTime)!) && (
                                <p className="text-sm text-red-600 md:col-span-2">
                                    Enter valid 12-hour times, and make sure
                                    the end time is later than the start time.
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="flex items-center justify-center gap-2"
                            disabled={
                                !closureDate ||
                                createClosure.isPending ||
                                (!isFullDay &&
                                    (!startTime ||
                                        !endTime ||
                                        !parse12HourTime(startTime) ||
                                        !parse12HourTime(endTime) ||
                                        parse12HourTime(startTime)! >=
                                            parse12HourTime(endTime)!))
                            }
                        >
                            <CalendarOff size={18} />
                            {isFullDay ? "Close Full Day" : "Close Time Range"}
                        </Button>
                    </div>
                </form>
            </Card>

            <Card className="space-y-4">
                <h2 className="text-xl font-semibold text-[#1E3D15]">
                    Closed dates
                </h2>

                {isLoading ? (
                    <p className="text-sm text-gray-500">Loading closed dates...</p>
                ) : isError ? (
                    <p className="text-sm text-red-600">
                        Could not load closed dates: {error.message}
                    </p>
                ) : data?.closures.length ? (
                    <ul className="divide-y divide-gray-200">
                        {data.closures.map((closure) => (
                            <li
                                key={closure.id}
                                className="flex flex-wrap items-center justify-between gap-3 py-4"
                            >
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {format(closure.closureDate, "MMMM dd, yyyy")}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {closure.startTime && closure.endTime
                                            ? `${formatTime(closure.startTime)} - ${formatTime(closure.endTime)}`
                                            : "Closed for 24 hours"}
                                    </p>
                                    {closure.reason && (
                                        <p className="text-sm text-gray-500">
                                            {closure.reason}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2"
                                    onClick={() => handleReopen(closure.id)}
                                    disabled={deleteClosure.isPending}
                                >
                                    <RotateCcw size={16} />
                                    Reopen
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">
                        No dates are currently closed.
                    </p>
                )}
            </Card>
        </div>
    );
}
