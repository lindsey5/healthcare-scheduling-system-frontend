import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { sileo, type SileoPosition } from "sileo";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const promiseToast = <T extends { message?: string}>(
    promise: Promise<T>,
    position: SileoPosition = "top-center",
    onSuccess?: (data : T) => void,
    successMessage?: string,
) => {
    return sileo.promise(promise, {
        position: position,
        loading: { title: "Loading...", },
        success: (data: T) => {
            setTimeout(() => {
                onSuccess ? onSuccess(data) : window.location.reload()
            }, 1000)
            
            return ({
                title: "Success",
                description: data?.message || successMessage,
            })
        },
        error: (err: any) => ({
            title: err?.message || "Something went wrong",
        }),
    });
};