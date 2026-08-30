import Card from "../../../components/ui/Card";
import Modal from "../../../components/ui/Modal";
import type { Audit } from "../../../types/audit.type";
import { formatDate } from "../../../utils/utils";

interface AuditModalProps {
    show: boolean;
    close: () => void;
    audit?: Audit;
}

function parseValues(
    values: string | Record<string, unknown>
): Record<string, unknown> {
    if (typeof values === "string") {
        try {
            return JSON.parse(values);
        } catch {
            return {};
        }
    }

    return values;
}

function formatValue(value: unknown) {
    if (value === null || value === undefined) {
        return "—";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
}

function formatFieldName(field: string) {
    return field
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (char) => char.toUpperCase());
}

interface ValuesDisplayProps {
    title: string;
    values: string | Record<string, unknown>;
}

function ValuesDisplay({
    title,
    values,
}: ValuesDisplayProps) {
    const parsedValues = parseValues(values);
    const entries = Object.entries(parsedValues);

    return (
        <div className="rounded-lg border border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-900">
                    {title}
                </h3>
            </div>

            <div className="divide-y divide-gray-100">
                {entries.length > 0 ? (
                    entries.map(([key, value]) => (
                        <div
                            key={key}
                            className="flex items-start justify-between gap-6 px-4 py-3"
                        >
                            <span className="text-sm font-medium text-gray-600">
                                {formatFieldName(key)}
                            </span>

                            <span className="break-all text-right text-sm text-gray-900">
                                {formatValue(value)}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="px-4 py-4 text-sm text-gray-500">
                        No values recorded.
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AuditModal({
    show,
    audit,
    close,
}: AuditModalProps) {

    return (
        <Modal
            onClose={close}
            open={show}
            className="max-w-[90vw] w-200 h-screen flex flex-col justify-center"
        >
            <Card className="relative w-full space-y-10 max-h-[80%] overflow-auto">
                <div className="w-full p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Audit Log Details
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Review the details of this activity.
                                </p>
                            </div>

                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    audit?.severity === "INFO"
                                        ? "bg-blue-100 text-blue-700"
                                        : audit?.severity === "WARNING"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {audit?.severity}
                            </span>
                        </div>
                    </div>

                    {/* Audit Information */}
                    <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Action
                            </p>

                            <p className="mt-1 font-semibold text-gray-900">
                                {audit?.action}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Entity
                            </p>

                            <p className="mt-1 font-semibold text-gray-900">
                                {audit?.entity}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                User Type
                            </p>

                            <p className="mt-1 font-semibold text-gray-900">
                                {audit?.userType}
                            </p>
                        </div>
                    </div>

                    {/* Old & New Values */}
                    <div className="mb-6">
                        <h3 className="mb-3 text-sm font-semibold text-gray-900">
                            Changes
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <ValuesDisplay
                                title="Old Values"
                                values={audit?.oldValues || ""}
                            />

                            <ValuesDisplay
                                title="New Values"
                                values={audit?.newValues || ""}
                            />
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="border-t border-gray-200 pt-5">
                        <h3 className="mb-3 text-sm font-semibold text-gray-900">
                            Activity Information
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    IP Address
                                </p>

                                <p className="mt-1 font-mono text-sm text-gray-700">
                                    {audit?.ipAddress}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Date
                                </p>

                                <p className="mt-1 text-sm text-gray-700">
                                    {formatDate(audit?.createdAt)}
                                </p>
                            </div>

                            <div className="md:col-span-2">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    User Agent
                                </p>

                                <p className="mt-1 break-all text-sm text-gray-700">
                                    {audit?.userAgent}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </Modal>
    );
}