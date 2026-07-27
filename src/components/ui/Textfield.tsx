import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}

                <input
                    {...registration}
                    {...props}
                    type={inputType}
                    onChange={handleChange}
                    className={`w-full border border-gray-300 rounded-xl ${
                        icon ? "pl-12" : "pl-4"
                    } ${
                        type === "password" ? "pr-12" : "pr-4"
                    } py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition ${className}`}
                />

                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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