import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Service } from "../../types/service.type";

type UpdateServicePayload = {
    serviceName: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
}

type UpdateServiceResponse = {
    service: Service;
    message: string;
}

const updateService = (id: number, data : UpdateServicePayload) => 
    apiAxios<UpdateServiceResponse>(`/api/services/${id}`, {
        method: "PUT",
        data
    })

export default function useUpdateService () {
    return useMutation({
        mutationFn: ({ data, id } : { data : UpdateServicePayload, id: number }) => updateService(id, data),
    })
}