
export default function SummaryRow({
    label,
    value,
}: {
    label: string;
    value?: string;
}) {

    return (
        <tr className="border-b border-gray-200">

            <td className="w-[40%] bg-gray-50 px-4 py-3 font-bold text-[#1E3D15]">
                {label}
            </td>


            <td className="px-4 py-3 text-gray-800 break-words">
                {value || "N/A"}
            </td>

        </tr>
    );
}