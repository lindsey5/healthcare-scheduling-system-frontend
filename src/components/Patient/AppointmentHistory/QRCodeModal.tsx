import Card from "../../ui/Card";
import Modal from "../../ui/Modal";
import { Download, X } from "lucide-react";
import { useRef } from "react";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import Button from "../../ui/Button";


interface QRCodeModalProps {
    show: boolean;
    close: () => void;
    referenceNumber: string;
}

export default function QRCodeModal ({
    close,
    show,
    referenceNumber
 } : QRCodeModalProps) {
    const qrRef = useRef<HTMLDivElement>(null);

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
        <Modal
            onClose={close}
            open={show}
        >
            <Card className="space-y-4">
                <div className="flex justify-end">
                    <button onClick={close} className="cursor-pointer">
                        <X size={20}/>
                    </button>
                </div>
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
            </Card>
        </Modal>
    )
}