import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

export type AppointmentCapacityDay =
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday";

export type AppointmentCapacity = {
    dayOfWeek: AppointmentCapacityDay;
    morningCapacity: number;
    afternoonCapacity: number;
};

type GetAppointmentCapacitiesResponse = {
    capacities: AppointmentCapacity[];
};

type UpdateAppointmentCapacityResponse = {
    message: string;
    capacity: AppointmentCapacity;
};

export const appointmentCapacitiesQueryKey = ["appointment-capacities"];

const getAppointmentCapacities = () =>
    apiAxios<GetAppointmentCapacitiesResponse>("/api/appointment-capacities");

const updateAppointmentCapacity = ({
    dayOfWeek,
    morningCapacity,
    afternoonCapacity,
}: AppointmentCapacity) =>
    apiAxios<UpdateAppointmentCapacityResponse>(
        `/api/appointment-capacities/${dayOfWeek}`,
        {
            method: "PUT",
            data: { morningCapacity, afternoonCapacity },
        }
    );

export function useAppointmentCapacities() {
    return useQuery({
        queryKey: appointmentCapacitiesQueryKey,
        queryFn: getAppointmentCapacities,
        refetchOnWindowFocus: false,
    });
}

export function useUpdateAppointmentCapacity() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAppointmentCapacity,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: appointmentCapacitiesQueryKey,
            }),
    });
}
