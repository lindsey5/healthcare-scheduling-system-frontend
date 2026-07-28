import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { sileo, type SileoPosition } from "sileo";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

export function getDayOfWeek(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
    });
}

export const scrollTo = (to : string) => {
    document.getElementById(to)?.scrollIntoView({
        behavior: "smooth",
    });
};

export const promiseToast = <T extends { message?: string }>(
    promise: Promise<T>,
    position: SileoPosition = "top-center",
    onSuccess?: (data: T) => void,
    successMessage?: string,
) => {
    return sileo.promise(promise, {
        position,

        loading: {
            title: "Loading...",
            fill: "#1E3D15",
            styles: {
                title: "text-white!",
                description: "text-green-100!",
            },
        },

        success: (data: T) => {
            setTimeout(() => {
                onSuccess ? onSuccess(data) : window.location.reload();
            }, 1000);

            return {
                title: "Success",
                description: data?.message || successMessage,
                fill: "#1E3D15",
                styles: {
                    title: "text-white!",
                    description: "text-green-100!",
                },
            };
        },

        error: (err: any) => ({
            title: err?.message || "Something went wrong",
            fill: "#DC2626",
            styles: {
                title: "text-white!",
                description: "text-red-100!",
            },
        }),
    });
};