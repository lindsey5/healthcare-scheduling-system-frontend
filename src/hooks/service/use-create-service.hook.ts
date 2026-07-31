import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Service } from "../../types/service.type";

type CreateServicePayload = {
    serviceName: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
}

type CreateServiceResponse = {
    service: Service;
    message: string;
}

const createService = (data : CreateServicePayload) => 
    apiAxios<CreateServiceResponse>("/api/services", {
        method: "POST",
        data
    })

export default function useCreateService () {
    return useMutation({
        mutationFn: (data : CreateServicePayload) => createService(data),
    })
}