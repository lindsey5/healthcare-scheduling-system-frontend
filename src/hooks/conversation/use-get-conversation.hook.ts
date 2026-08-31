import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { PaginationParams, PaginationResponse } from "../../types/pagination.type";
import type { Conversation, Message } from "../../types/conversation.type";

interface GetConversationByIdResponse extends PaginationResponse {
    messages: Message[];
    conversation: Conversation;
}

const getConversationById = (id: number, params: PaginationParams) => 
    apiAxios<GetConversationByIdResponse>(`/api/conversations/${id}`, {
        method: 'GET',
        params
    })

export default function useGetConversationById (id: number, params: PaginationParams) {
    return useQuery<GetConversationByIdResponse, Error>({
        queryKey: ['conversation', id, params],
        queryFn: () => getConversationById(id, params),
        refetchOnWindowFocus: false
    })
}