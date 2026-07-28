import { cn } from "../../utils/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
}

export default function Button ({
    className,
    ...props
} : ButtonProps) {

    return (
        <button
            {...props}
            type="submit"
            className={cn(
                "px-4 bg-[#1E3D15] hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition cursor-pointer",
                className
            )}
        />
    )
}