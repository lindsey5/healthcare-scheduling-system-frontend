import { cn } from "../../utils/utils";

type Severity = "INFO" | "WARNING" | "CRITICAL";

interface SeverityChipProps {
    severity: Severity;
}

const severityStyles: Record<Severity, string> = {
    INFO: "bg-blue-100 text-blue-700",
    WARNING: "bg-yellow-100 text-yellow-700",
    CRITICAL: "bg-red-100 text-red-700",
};

export const SeverityChip = ({
    severity,
}: SeverityChipProps) => {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                severityStyles[severity]
            )}
        >
            {severity}
        </span>
    );
};