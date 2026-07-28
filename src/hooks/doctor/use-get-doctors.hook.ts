import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Doctor } from "../../types/doctor.type";

type GetDoctorsResponse = {
    doctors: Doctor[];
}

type GetDoctorsParams = {
    status?: string;
    serviceId?: number;
}

const getDoctors = (params: GetDoctorsParams) => 
    apiAxios<GetDoctorsResponse>("/api/doctors", {
        method: "GET",
        params
    })

export default function useGetDoctors (params : GetDoctorsParams) {
    return useQuery<GetDoctorsResponse, Error>({
        queryKey: ['doctors', params],
        queryFn: () => getDoctors(params),
        refetchOnWindowFocus: false
    })
}