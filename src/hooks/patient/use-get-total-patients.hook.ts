import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

interface GetTotalPatientsResponse {
    total: number;
}

const getTotalPatients = () => 
    apiAxios<GetTotalPatientsResponse>('/api/patients/total', {
        method: 'GET',
    })

export default function useGetTotalPatients () {
    return useQuery<GetTotalPatientsResponse, Error>({
        queryKey: ['patients/total'],
        queryFn: () => getTotalPatients(),
        refetchOnWindowFocus: false
    })
}