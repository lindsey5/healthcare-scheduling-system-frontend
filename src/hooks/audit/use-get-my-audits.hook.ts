import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Audit } from "../../types/audit.type";
import type { PaginationParams, PaginationResponse } from "../../types/pagination.type";

interface GetMyAuditsParams extends PaginationParams {
    search?: string;
    severity?: string;
    startDate?: string;
    endDate?: string;
}

interface GetMyAuditsResponse extends PaginationResponse {
    audits: Audit[];
}

const getMyAudits = (params : GetMyAuditsParams) => 
    apiAxios<GetMyAuditsResponse>('/api/audits/me', {
        method: 'GET',
        params
    })

export default function useGetMyAudits (params : GetMyAuditsParams) {
    return useQuery<GetMyAuditsResponse, Error>({
        queryKey: ['my-audits', params],
        queryFn: () => getMyAudits(params),
        refetchOnWindowFocus: false
    })
}