import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Audit } from "../../types/audit.type";
import type { PaginationParams, PaginationResponse } from "../../types/pagination.type";

interface GetAuditsParams extends PaginationParams {
    search?: string;
    severity?: string;
    userType?: string;
    startDate?: string;
    endDate?: string;
}

interface GetAuditsResponse extends PaginationResponse {
    audits: Audit[];
}

const getAudits = (params : GetAuditsParams) => 
    apiAxios<GetAuditsResponse>('/api/audits', {
        method: 'GET',
        params
    })

export default function useGetAudits (params : GetAuditsParams) {
    return useQuery<GetAuditsResponse, Error>({
        queryKey: ['audits', params],
        queryFn: () => getAudits(params),
        refetchOnWindowFocus: false
    })
}