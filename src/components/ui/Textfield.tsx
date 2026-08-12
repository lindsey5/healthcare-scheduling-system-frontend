import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../utils/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
    registration?: any;
    icon?: React.ReactNode;
};

export default function Textfield({
    label,
    type = "text",
    className = "",
    error,
    registration,
    icon,
    onChange,
    disabled,
    ...props
}: InputProps) {

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (registration?.onChange) registration.onChange(e);
        if (onChange) onChange(e);
    };

    const inputType =
        type === "password"
            ? showPassword
                ? "text"
                : "password"
            : type;

    return (
        <div>

            {label && (
                <label
                    className={cn(
                        "block text-sm font-medium mb-2",
                        disabled
                            ? "text-gray-400"
                            : "text-gray-700"
                    )}
                >
                    {label}
                </label>
            )}

            <div className="relative">

                {icon && (
                    <div
                        className={cn(
                            "absolute left-4 top-1/2 -translate-y-1/2",
                            disabled
                                ? "text-gray-300"
                                : "text-gray-400"
                        )}
                    >
                        {icon}
                    </div>
                )}

                <input
                    {...registration}
                    {...props}
                    disabled={disabled}
                    type={inputType}
                    onChange={handleChange}
                    className={cn(
                        "w-full border rounded-xl",
                        icon ? "pl-12" : "pl-4",
                        type === "password" ? "pr-12" : "pr-4",
                        "py-3 outline-none transition",

                        disabled
                            ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                            : "bg-white border-gray-400 text-gray-900 focus:border-green-600 focus:ring-2 focus:ring-green-100",

                        className,

                        error && !disabled && "border-red-500"
                    )}
                />

                {type === "password" && (
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => setShowPassword(!showPassword)}
                        className={cn(
                            "absolute right-4 top-1/2 -translate-y-1/2",
                            disabled
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        {showPassword ? (
                            <EyeOff size={20} />
                        ) : (
                            <Eye size={20} />
                        )}
                    </button>
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