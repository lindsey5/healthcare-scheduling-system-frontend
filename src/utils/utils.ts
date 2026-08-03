import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { sileo, type SileoPosition } from "sileo";
import type { SortOption } from "../types/types";

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

export function getKeyByValue(
    obj: Record<string, SortOption>,
    target: SortOption
) {
    return Object.keys(obj).find(key => {
        const value = obj[key]
        return (
            value.sort === target.sort &&
            value.order === target.order
        )
    })
}

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

export const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return '';

    const d = typeof date === 'string' ? new Date(date) : date;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM

    const formattedHours = String(hours).padStart(2, '0');

    return `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`;
};