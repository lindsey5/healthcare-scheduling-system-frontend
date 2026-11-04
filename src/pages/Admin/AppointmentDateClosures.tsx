import { useState, type FormEvent } from "react";
import { CalendarOff, RotateCcw } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Textfield from "../../components/ui/Textfield";
import Dropdown from "../../components/ui/Dropdown";
import { timeSlots } from "../../lib/constants/constants";
import {
    useAppointmentDateClosures,
    useCreateAppointmentDateClosure,
    useDeleteAppointmentDateClosure,
} from "../../hooks/appointment/use-appointment-date-closures.hook";
import { formatTime, promiseToast } from "../../utils/utils";
import { format } from "date-fns";

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
    const endTimeOptions = timeSlots.filter(
        (time) => time.value > startTime
    );

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (
            !isFullDay &&
            (!startTime || !endTime || startTime >= endTime)
        ) {
            return;
        }

        promiseToast(
            createClosure.mutateAsync({
                closureDate,
                startTime: isFullDay ? null : startTime,
                endTime: isFullDay ? null : endTime,
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
                            <Dropdown
                                label="From"
                                value={startTime}
                                options={timeSlots}
                                placeholder="Select start time"
                                onChange={(event) => {
                                    const nextStartTime = event.target.value;
                                    setStartTime(nextStartTime);
                                    if (endTime && endTime <= nextStartTime) {
                                        setEndTime("");
                                    }
                                }}
                            />
                            <Dropdown
                                label="To"
                                value={endTime}
                                options={endTimeOptions}
                                placeholder="Select end time"
                                disabled={!startTime}
                                onChange={(event) =>
                                    setEndTime(event.target.value)
                                }
                            />
                            {startTime &&
                                endTime &&
                                endTime <= startTime && (
                                <p className="text-sm text-red-600 md:col-span-2">
                                    End time must be later than start time.
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
                                        startTime >= endTime))
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
