import {
    CheckCircle2,
    Download,
} from "lucide-react";
import { useRef } from "react";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import Button from "../../../components/ui/Button";

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
        <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-10">
            <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-7 sm:px-8">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-[#1E3D15]" />
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Appointment Submitted Successfully!
                            </h1>
                            <p className="mt-2 text-gray-600">
                                The health center will review your request. You
                                can check its status in Appointment History.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="space-y-7 p-6 sm:p-8">
                    <div>
                        <p className="text-sm font-medium text-gray-500">
                            Reference number
                        </p>
                        <p className="mt-1 break-all text-xl font-semibold text-gray-900">
                            {referenceNumber}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            Keep this number for your records.
                        </p>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center border-y border-gray-200 py-6 text-center">
                        <p className="font-medium text-gray-900">Appointment QR code</p>
                        <div className="mt-4 flex justify-center">
                            <div
                                ref={qrRef}
                                className="inline-block bg-white p-3"
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

                        <p className="mt-3 max-w-md text-sm text-gray-600">
                            Save this code and present it when you arrive for
                            your appointment.
                        </p>

                        <Button
                            className="mt-4 flex items-center"
                            variant="outline"
                            onClick={downloadQRCode}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Download QR code
                        </Button>
                    </div>

                    <div>
                        <h2 className="font-semibold text-gray-900">
                            What happens next
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                            Once your appointment is approved, arrive 15 minutes
                            before your scheduled time and bring your QR code.
                        </p>
                    </div>

                    <Button
                        className="w-full"
                        onClick={() => window.location.reload()}
                    >
                        Book Another Appointment
                    </Button>
                </div>
            </div>
        </div>
    );
}