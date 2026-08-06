import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { ScanLine, CheckCircle2, CircleAlert } from "lucide-react";
import AppointmentModal from "../Appointments/AppointmentModal";
import useGetAppointment from "../../hooks/appointment/use-get-appointment.hook";

export default function ScanQr() {
    const [refNo, setRefNo] = useState("");
    const [status, setStatus] = useState<
        "idle" | "scanning" | "success" | "error"
    >("idle");

    const [scanned, setScanned] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const { data, isLoading, isError } = useGetAppointment(refNo);

    useEffect(() => {
        if (!refNo) return;

        if (data?.appointment) {
            setStatus("success");
            setShowModal(true);
        }
    }, [data, refNo]);

    useEffect(() => {
        if (isError) {
            setStatus("error");

            setTimeout(() => {
                setStatus("idle");
                setScanned(false);
                setRefNo("");
            }, 2000);
        }
    }, [isError]);

    const handleCloseModal = () => {
        setShowModal(false);
        setRefNo("");
        setScanned(false);
        setStatus("idle");
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
            <AppointmentModal
                appointment={data?.appointment}
                show={showModal}
                close={handleCloseModal}
            />

            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden">
                {/* Header */}
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-green-100 p-3">
                            <ScanLine className="h-6 w-6 text-green-600" />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-slate-800">
                                QR Code Scanner
                            </h1>
                            <p className="text-sm text-slate-500">
                                Scan the patient's appointment QR code.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Scanner */}
                <div className="p-6">
                    <div className="relative overflow-hidden rounded-2xl border-4 border-green-500 bg-black">
                        <Scanner
                            constraints={{
                                facingMode: "environment",
                            }}
                            onScan={(result) => {
                                if (scanned || result.length === 0) return;

                                const reference = result[0].rawValue.trim();

                                setScanned(true);
                                setStatus("scanning");
                                setRefNo(reference);
                            }}
                            onError={(error) => {
                                console.error(error);
                            }}
                        />

                        {/* Overlay */}
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <div className="relative h-60 w-60 rounded-xl border-4 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
                                <div className="absolute left-0 top-1/2 h-1 w-full animate-pulse bg-green-400" />
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="mt-6 rounded-xl bg-slate-50 p-4 text-center">
                        {status === "idle" && (
                            <p className="text-sm text-slate-600">
                                Position the QR code inside the frame.
                            </p>
                        )}

                        {status === "scanning" && (
                            <p className="text-sm font-medium text-blue-600">
                                Fetching appointment...
                            </p>
                        )}

                        {status === "success" && (
                            <div className="flex items-center justify-center gap-2 text-green-600">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="font-medium">
                                    Appointment found
                                </span>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="flex items-center justify-center gap-2 text-red-600">
                                <CircleAlert className="h-5 w-5" />
                                <span className="font-medium">
                                    Appointment not found
                                </span>
                            </div>
                        )}

                        {isLoading && (
                            <p className="mt-2 text-xs text-slate-500">
                                Please wait...
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}