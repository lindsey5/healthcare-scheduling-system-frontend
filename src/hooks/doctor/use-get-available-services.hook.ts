import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Service } from "../../types/service.type";

export type AvailableServiceSchedule = {
    day: string;
    startTime: string;
    endTime: string;
};

type GetAvailableServicesResponse = {
    services: Service[];
};

type GetAvailableServicesParams = {
    schedules: AvailableServiceSchedule[];
};

const getAvailableServices = ({
    schedules,
}: GetAvailableServicesParams) =>
    apiAxios<GetAvailableServicesResponse>(
        `/api/services/available`,
        {
            method: "GET",
            params: {
                schedules: JSON.stringify(schedules),
            },
        }
    );

export default function useGetAvailableServices(
    params: GetAvailableServicesParams
) {
    return useQuery<GetAvailableServicesResponse, Error>({
        queryKey: [
            "available-services",
            params.schedules,
        ],
        queryFn: () => getAvailableServices(params),
        enabled:
            params.schedules.length > 0,
        refetchOnWindowFocus: false,
    });
}