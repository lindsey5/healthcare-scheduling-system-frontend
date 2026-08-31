import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Audit } from "../../types/audit.type";

interface GetAuditsResponse {
    audits: Audit[];
}

const getRecentAudits = () => 
    apiAxios<GetAuditsResponse>('/api/audits/recent', {
        method: 'GET',
    })

export default function useGetRecentAudits () {
    return useQuery<GetAuditsResponse, Error>({
        queryKey: ['audits/recent'],
        queryFn: () => getRecentAudits(),
        refetchOnWindowFocus: false
    })
}