import Card from "./Card";

export default function DashboardCard({
    title,
    value,
    icon,
    onClick,
}: {
    title: string;
    value: string;
    icon: React.ReactNode;
    onClick?: () => void;
}) {
    return (
        <Card className="flex items-center gap-4" onClick={onClick}>
            <div className="bg-green-100 text-[#1E3D15] p-3 rounded-lg">
                {icon}
            </div>

            <div>
                <p className="text-gray-500 text-sm">
                    {title}
                </p>

                <h2 className="text-2xl font-bold">
                    {value}
                </h2>
            </div>
        </Card>
    );
}