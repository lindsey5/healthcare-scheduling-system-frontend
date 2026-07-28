
export default function SummarySection({
    title,
    icon,
    children,
}: {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}) {

    return (
        <div className="space-y-3">

            <h2 className="flex items-center gap-2 text-xl font-bold text-[#1E3D15]">
                {icon}
                {title}
            </h2>


            <div className="border-t border-gray-200">

                <table className="w-full text-sm">

                    <tbody>
                        {children}
                    </tbody>

                </table>

            </div>

        </div>
    );
}