import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Admin } from "../../types/admin.type";

interface GetAdminsParams {
    search?: string;
}

interface GetAdminsResponse {
    admins: Admin[];
}

const getAdmins = (params : GetAdminsParams) => 
    apiAxios<GetAdminsResponse>('/api/admins', {
        method: 'GET',
        params
    })

export default function useGetAdmins (params : GetAdminsParams) {
    return useQuery<GetAdminsResponse, Error>({
        queryKey: ['admins', params],
        queryFn: () => getAdmins(params),
        refetchOnWindowFocus: false
    })
}