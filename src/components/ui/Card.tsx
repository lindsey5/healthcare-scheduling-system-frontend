import { cn } from "../../utils/utils";

export default function Card ({ children, className } : { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("bg-white p-5 rounded-xl shadow-md border border-gray-200", className)}>
            {children}
        </div>
    )
}