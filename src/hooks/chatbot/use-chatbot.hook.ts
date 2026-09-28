import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

type ChatbotResponse = {
    thread_id: string;
    message: string;
}

const sendMessage = async (message: string, thread_id?: string): Promise<ChatbotResponse> => apiAxios<ChatbotResponse>(`/api/ai/chat`, {
    method: 'POST',
    data: { message, thread_id }
})

export default function useChatbot () {
    return useMutation({
        mutationFn: ({ message, thread_id } : { message: string, thread_id?: string }) => sendMessage(message, thread_id)
    })
}