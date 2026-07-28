import React from "react";
import { cn } from "../../utils/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
    registration?: any;
    icon?: React.ReactNode;
};

export default function Textarea({
    label,
    error,
    registration,
    icon,
    className = "",
    onChange,
    disabled,
    ...props
}: TextareaProps) {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        registration?.onChange?.(e);
        onChange?.(e);
    };

    return (
        <div>
            {label && (
                <label
                    className={`block text-sm font-medium mb-2 ${
                        disabled ? "text-gray-400" : "text-gray-700"
                    }`}
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <div
                        className={`absolute left-4 top-4 pointer-events-none ${
                            disabled ? "text-gray-300" : "text-gray-400"
                        }`}
                    >
                        {icon}
                    </div>
                )}

                <textarea
                    {...registration}
                    {...props}
                    disabled={disabled}
                    onChange={handleChange}
                    className={cn(
                        " w-full rounded-xl border resize-none pr-4 py-3 transition outline-none",
                        icon ? "pl-12" : "pl-4",
                        disabled ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400" : "border-gray-300 bg-white text-gray-700 focus:border-green-600 focus:ring-2 focus:ring-green-100",
                        className,
                        error && 'border-red-500'

                    )}
                />

                {icon && (
                    <div className="absolute left-4 top-4 pointer-events-none">
                        {icon}
                    </div>
                )}
            </div>

            {error && (
                <span className="mt-1 block text-sm text-red-500">
                    {error}
                </span>
            )}
        </div>
    );
}