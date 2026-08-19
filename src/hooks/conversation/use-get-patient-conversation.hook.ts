import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { PaginationParams, PaginationResponse } from "../../types/pagination.type";
import type { Conversation, Message } from "../../types/conversation.type";

interface GetPatientConversationResponse extends PaginationResponse {
    messages: Message[];
    conversation: Conversation;
}

const getPatientConversation = (params : PaginationParams) => 
    apiAxios<GetPatientConversationResponse>('/api/conversations/patient', {
        method: 'GET',
        params
    })

export default function useGetPatientConversation (params : PaginationParams) {
    return useQuery<GetPatientConversationResponse, Error>({
        queryKey: ['conversations/patient', params],
        queryFn: () => getPatientConversation(params),
        refetchOnWindowFocus: false
    })
}