import { cn } from "../../utils/utils";

export default function Card ({ children, className, onClick } : { children: React.ReactNode, className?: string, onClick?: () => void }) {
    return (
        <div className={cn("bg-white p-5 rounded-xl shadow-md border border-gray-200", className)} onClick={onClick}>
            {children}
        </div>
    )
}