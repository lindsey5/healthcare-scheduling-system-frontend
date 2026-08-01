import { cn } from "../../utils/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "outline";
    className?: string;
};

const variants = {
    primary:
        "bg-[#1E3D15] hover:bg-green-800 text-white",

    secondary:
        "bg-gray-600 hover:bg-gray-700 text-white",

    success:
        "bg-green-600 hover:bg-green-700 text-white",

    danger:
        "bg-red-600 hover:bg-red-700 text-white",

    warning:
        "bg-yellow-500 hover:bg-yellow-600 text-white",

    outline:
        "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
};

export default function Button({
    variant = "primary",
    className,
    type = "button",
    ...props
}: ButtonProps) {
    return (
        <button
            {...props}
            type={type}
            className={cn(
                "px-4 py-3 rounded-xl font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                className
            )}
        />
    );
}