import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { PaginationParams, PaginationResponse } from "../../types/pagination.type";
import type { Patient } from "../../types/patient.type";

interface GetPatientsParams extends PaginationParams {
    search?: string;
}

interface GetPatientsResponse extends PaginationResponse {
    patients: Patient[];
}

const getPatients = (params : GetPatientsParams) => 
    apiAxios<GetPatientsResponse>('/api/patients', {
        method: 'GET',
        params
    })

export default function useGetPatients (params : GetPatientsParams) {
    return useQuery<GetPatientsResponse, Error>({
        queryKey: ['patients', params],
        queryFn: () => getPatients(params),
        refetchOnWindowFocus: false
    })
}