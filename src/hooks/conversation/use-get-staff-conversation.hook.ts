import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { PaginationParams, PaginationResponse } from "../../types/pagination.type";
import type { Conversation, Message } from "../../types/conversation.type";

interface GetStaffConversationByIdResponse extends PaginationResponse {
    messages: Message[];
    conversation: Conversation;
}

const getStaffConversationById = (id: number, params: PaginationParams) => 
    apiAxios<GetStaffConversationByIdResponse>(`/api/conversations/staff/${id}`, {
        method: 'GET',
        params
    })

export default function useGetStaffConversationById (id: number, params: PaginationParams) {
    return useQuery<GetStaffConversationByIdResponse, Error>({
        queryKey: ['conversations/staff', id],
        queryFn: () => getStaffConversationById(id, params),
        refetchOnWindowFocus: false
    })
}