import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Service } from "../../types/service.type";

type GetServicesResponse = {
    services: Service[];
}

const getServices = (dayOfWeek?: string) => 
    apiAxios<GetServicesResponse>("/api/services", {
        method: "GET",
        params: { dayOfWeek }
    })

export default function useGetServices (dayOfWeek?: string) {
    return useQuery<GetServicesResponse, Error>({
        queryKey: ['services', dayOfWeek],
        queryFn: () => getServices(dayOfWeek),
        refetchOnWindowFocus: false
    })
}