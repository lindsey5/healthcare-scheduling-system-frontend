import { useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Textfield from "../../components/ui/Textfield";
import { DAYS } from "../../lib/constants/constants";
import {
    useAppointmentCapacities,
    useUpdateAppointmentCapacity,
    type AppointmentCapacity,
    type AppointmentCapacityDay,
} from "../../hooks/appointment/use-appointment-capacities.hook";
import { promiseToast } from "../../utils/utils";

type CapacityValues = Record<
    AppointmentCapacityDay,
    { morningCapacity: string; afternoonCapacity: string }
>;

export default function AppointmentCapacities() {
    const { data, isLoading, isError, error } = useAppointmentCapacities();
    const updateCapacity = useUpdateAppointmentCapacity();
    const [capacities, setCapacities] = useState<
        Partial<CapacityValues>
    >({});

    const handleSubmit = (
        event: FormEvent<HTMLFormElement>,
        dayOfWeek: AppointmentCapacityDay,
        values: CapacityValues[AppointmentCapacityDay]
    ) => {
        event.preventDefault();
        const morningCapacity = Number(values.morningCapacity);
        const afternoonCapacity = Number(values.afternoonCapacity);

        if (
            !Number.isSafeInteger(morningCapacity) ||
            morningCapacity < 0 ||
            !Number.isSafeInteger(afternoonCapacity) ||
            afternoonCapacity < 0
        ) {
            return;
        }

        const update: AppointmentCapacity = {
            dayOfWeek,
            morningCapacity,
            afternoonCapacity,
        };
        promiseToast(
            updateCapacity.mutateAsync(update),
            "top-center",
            () =>
                setCapacities((current) => ({
                    ...current,
                    [dayOfWeek]: undefined,
                }))
        );
    };

    return (
        <div className="flex min-h-screen flex-1 flex-col gap-6 overflow-auto p-6">
            <div>
                <h1 className="text-3xl font-bold text-[#1E3D15]">
                    Appointment Slot Capacity
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    Set the maximum number of appointments the clinic can accept
                    in the morning and afternoon for each weekday. Each limit
                    applies to all services and doctors combined. Set a limit
                    to 0 to stop bookings for that period.
                </p>
            </div>

            <Card className="space-y-5">
                {isLoading ? (
                    <p className="text-sm text-gray-500">
                        Loading appointment capacities...
                    </p>
                ) : isError ? (
                    <p className="text-sm text-red-600">
                        Could not load appointment capacities: {error.message}
                    </p>
                ) : (
                    <div className="space-y-4">
                        {DAYS.map((day) => {
                            const dayOfWeek = day as AppointmentCapacityDay;
                            const savedCapacity = data?.capacities.find(
                                (capacity) => capacity.dayOfWeek === dayOfWeek
                            );
                            const values = capacities[dayOfWeek] ?? {
                                morningCapacity:
                                    savedCapacity === undefined
                                        ? ""
                                        : String(savedCapacity.morningCapacity),
                                afternoonCapacity:
                                    savedCapacity === undefined
                                        ? ""
                                        : String(savedCapacity.afternoonCapacity),
                            };
                            const isValid =
                                Number.isSafeInteger(
                                    Number(values.morningCapacity)
                                ) &&
                                Number(values.morningCapacity) >= 0 &&
                                Number.isSafeInteger(
                                    Number(values.afternoonCapacity)
                                ) &&
                                Number(values.afternoonCapacity) >= 0;

                            return (
                                <form
                                    key={day}
                                    onSubmit={(event) =>
                                        handleSubmit(event, dayOfWeek, values)
                                    }
                                    className="grid items-end gap-4 border-b border-gray-200 pb-4 last:border-0 md:grid-cols-[1fr_1fr_1fr_auto]"
                                >
                                    <h2 className="font-semibold text-gray-800">
                                        {day}
                                    </h2>
                                    <Textfield
                                        label="Morning appointments"
                                        type="number"
                                        min={0}
                                        max={2147483647}
                                        step={1}
                                        required
                                        value={values.morningCapacity}
                                        onChange={(event) =>
                                            setCapacities((current) => ({
                                                ...current,
                                                [dayOfWeek]: {
                                                    ...values,
                                                    morningCapacity:
                                                        event.target.value,
                                                },
                                            }))
                                        }
                                    />
                                    <Textfield
                                        label="Afternoon appointments"
                                        type="number"
                                        min={0}
                                        max={2147483647}
                                        step={1}
                                        required
                                        value={values.afternoonCapacity}
                                        onChange={(event) =>
                                            setCapacities((current) => ({
                                                ...current,
                                                [dayOfWeek]: {
                                                    ...values,
                                                    afternoonCapacity:
                                                        event.target.value,
                                                },
                                            }))
                                        }
                                    />
                                    <Button
                                        type="submit"
                                        disabled={
                                            updateCapacity.isPending || !isValid
                                        }
                                        className="flex items-center justify-center gap-2"
                                    >
                                        <Save size={16} />
                                        Save
                                    </Button>
                                </form>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );
}
