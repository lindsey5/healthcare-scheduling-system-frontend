import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import useGetRecentAudits from "../../hooks/audit/use-get-recent-audits.hook";
import { cn, formatDate } from "../../utils/utils";
import Card from "../../components/ui/Card";

export default function RecentActivities() {
    const { data, isLoading } = useGetRecentAudits();

    const audits = data?.audits ?? [];

    return (
        <Card className="flex-1">
            <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900">
                    Recent Activities
                </h2>
                <p className="text-sm text-gray-500">
                    Latest system activities
                </p>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <p className="text-sm text-gray-500">
                        Loading activities...
                    </p>
                ) : audits.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        No recent activities.
                    </p>
                ) : (
                    audits.map((audit) => {
                        const Icon =
                            audit.severity === "CRITICAL"
                                ? AlertTriangle
                                : audit.severity === "WARNING"
                                    ? AlertTriangle
                                    : Info;

                        return (
                            <div
                                key={audit.id}
                                className="flex items-start gap-3"
                            >
                                <div
                                    className={cn(
                                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                                        audit.severity === "CRITICAL" &&
                                            "bg-red-100 text-red-600",
                                        audit.severity === "WARNING" &&
                                            "bg-yellow-100 text-yellow-600",
                                        audit.severity === "INFO" &&
                                            "bg-blue-100 text-blue-600"
                                    )}
                                >
                                    <Icon size={17} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        {audit.entity} has been {audit.action}D
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                        {formatDate(audit.createdAt)}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </Card>
    );
}