import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Card from "./Card";

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);

interface ChartProps {
    title: string;
    labels: string[];
    values: number[];
    formatToPeso: boolean;
}

export default function Chart({
    title,
    labels,
    values,
}: ChartProps) {
    const data = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: "#22c55e", // Green bars
                hoverBackgroundColor: "#16a34a", // Darker green on hover
                borderSkipped: false,
                maxBarThickness: 40,
            },
        ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: "#ffffff",
                titleColor: "#16a34a",
                bodyColor: "#16a34a",
                borderColor: "#22c55e",
                borderWidth: 1,
                padding: 10,
                displayColors: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: "#6b7280",
                    maxRotation: 0,
                    minRotation: 0,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: "#e5e7eb",
                },
                ticks: {
                    color: "#6b7280",
                    callback: (value: any) =>
                        window.innerWidth < 768 ? "" : value,
                },
            },
        },
    };

    return (
        <Card className="w-full h-[300px] md:h-[500px] p-3 md:p-5">
            <h2 className="text-sm sm:text-base md:text-lg font-bold mb-4 sm:mb-8">
                {title}
            </h2>

            <div className="h-[85%] w-full">
                <Bar data={data} options={options} />
            </div>
        </Card>
    );
}

export const ChartSkeleton = () => (
    <Card className="flex flex-col gap-5 w-full h-[300px] md:h-[500px] animate-pulse">
        <div className="w-[60%] md:w-[40%] h-10 bg-gray-400 rounded-md"></div>
        <div className="w-full flex-1 bg-gray-400 rounded-md"></div>
    </Card>
);