import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

export type AppointmentDateClosure = {
    id: number;
    closureDate: string;
    reason: string | null;
    createdAt: string;
};

type GetClosuresResponse = {
    closures: AppointmentDateClosure[];
};

type CreateClosureResponse = {
    message: string;
    closure: AppointmentDateClosure;
};

type ClosureActionResponse = {
    message: string;
};

export const appointmentDateClosuresQueryKey = [
    "appointment-date-closures",
];

const getAppointmentDateClosures = () =>
    apiAxios<GetClosuresResponse>("/api/appointment-date-closures");

const createAppointmentDateClosure = (data: {
    closureDate: string;
    reason: string;
}) =>
    apiAxios<CreateClosureResponse>("/api/appointment-date-closures", {
        method: "POST",
        data,
    });

const deleteAppointmentDateClosure = (id: number) =>
    apiAxios<ClosureActionResponse>(
        `/api/appointment-date-closures/${id}`,
        { method: "DELETE" }
    );

export function useAppointmentDateClosures() {
    return useQuery({
        queryKey: appointmentDateClosuresQueryKey,
        queryFn: getAppointmentDateClosures,
        refetchOnWindowFocus: false,
    });
}

export function useCreateAppointmentDateClosure() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAppointmentDateClosure,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: appointmentDateClosuresQueryKey,
            }),
    });
}

export function useDeleteAppointmentDateClosure() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAppointmentDateClosure,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: appointmentDateClosuresQueryKey,
            }),
    });
}
