import {
    CheckCircle2,
    CalendarDays,
    ClipboardList,
    Clock3,
    ShieldCheck,
    Download,
} from "lucide-react";
import { useRef } from "react";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import Button from "../../ui/Button";

interface AppointmentSuccessProps {
    referenceNumber?: string;
}

export default function AppointmentSuccess({
    referenceNumber,
}: AppointmentSuccessProps) {
    const qrRef = useRef<HTMLDivElement>(null);

    if (!referenceNumber) return null;

    const downloadQRCode = async () => {
        if (!qrRef.current) return;

        try {
            const dataUrl = await toPng(qrRef.current, {
                cacheBust: true,
                pixelRatio: 3,
            });

            const link = document.createElement("a");
            link.download = `appointment-${referenceNumber}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error("Failed to download QR Code:", error);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-10">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-[#1E3D15] px-8 py-10 text-center text-white">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/15">
                        <CheckCircle2 className="h-12 w-12 text-green-300" />
                    </div>

                    <h1 className="text-3xl font-bold">
                        Appointment Submitted Successfully!
                    </h1>

                    <p className="mt-3 text-green-100 leading-relaxed">
                        Your appointment request has been successfully
                        submitted. Please wait for approval from the Barangay
                        Health Center.
                    </p>
                </div>

                {/* Body */}
                <div className="p-8">
                    {/* QR Code */}
                    <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
                        <p className="text-sm font-medium text-gray-600">
                            Appointment QR Code
                        </p>

                        <div className="mt-5 flex justify-center">
                            <div
                                ref={qrRef}
                                className="inline-block rounded-xl bg-white p-6 shadow-md"
                            >
                                <QRCode
                                    value={referenceNumber}
                                    size={180}
                                    bgColor="#FFFFFF"
                                    fgColor="#1E3D15"
                                    level="H"
                                />
                            </div>
                        </div>

                        <p className="mt-4 text-sm text-gray-600">
                            Please save or download this QR code. Present it to
                            the Barangay Health Center during your appointment
                            for faster verification.
                        </p>

                        <div className="flex justify-center">
                            <Button
                                className="mt-5 flex items-center"
                                variant="secondary"
                                onClick={downloadQRCode}
                            >
                                <Download className="mr-2 h-5 w-5" />
                                Download QR Code
                            </Button>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="mt-8">
                        <div className="mb-5 flex items-center gap-2">
                            <ClipboardList className="h-5 w-5 text-[#1E3D15]" />
                            <h3 className="text-lg font-semibold text-gray-900">
                                What's Next?
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4">
                                <Clock3 className="mt-1 h-5 w-5 text-amber-500" />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Pending Approval
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Your appointment is currently waiting
                                        for approval from the health center.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4">
                                <ShieldCheck className="mt-1 h-5 w-5 text-blue-500" />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Staff Review
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        The Barangay Health Center staff will
                                        review your appointment request.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4">
                                <ClipboardList className="mt-1 h-5 w-5 text-purple-500" />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Track Your Appointment
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        You can monitor the status anytime from{" "}
                                        <span className="font-medium">
                                            Appointment History
                                        </span>{" "}
                                        page.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4">
                                <CalendarDays className="mt-1 h-5 w-5 text-green-600" />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Arrival Reminder
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Once approved, please arrive at least{" "}
                                        <span className="font-semibold">
                                            15 minutes
                                        </span>{" "}
                                        before your scheduled appointment and
                                        present your QR code upon arrival.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button
                        className="mt-8 w-full"
                        onClick={() => window.location.reload()}
                    >
                        Book Another Appointment
                    </Button>
                </div>
            </div>
        </div>
    );
}