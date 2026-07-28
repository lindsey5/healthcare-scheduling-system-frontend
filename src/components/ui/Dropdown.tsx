import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/utils";

type Option = {
    label: string;
    value: string | number;
};

type DropdownProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    options: Option[];
    placeholder?: string;
};

export default function Dropdown({
    label,
    error,
    icon,
    options,
    placeholder = "Select an option",
    className = "",
    disabled,
    value,
    ...props
}: DropdownProps) {

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
                        className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${
                            disabled ? "text-gray-300" : "text-gray-400"
                        }`}
                    >
                        {icon}
                    </div>
                )}

                <select
                    {...props}
                    disabled={disabled}
                    className={cn(
                        "w-full appearance-none rounded-xl border",
                        icon ? "pl-12" : "pl-4",
                        "pr-12 py-3 transition outline-none",
                        disabled ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400" : "border-gray-300 bg-white text-gray-700 focus:border-green-600 focus:ring-2 focus:ring-green-100",
                        className,
                        error && 'border-red-500'
                    )}
                >
                    <option value="" disabled={!!value}>
                        {placeholder}
                    </option>

                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <ChevronDown
                    size={20}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${
                        disabled ? "text-gray-300" : "text-gray-400"
                    }`}
                />
            </div>

            {error && (
                <span className="mt-1 block text-sm text-red-500">
                    {error}
                </span>
            )}
        </div>
    );
}