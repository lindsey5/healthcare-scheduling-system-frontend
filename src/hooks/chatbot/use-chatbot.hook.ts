import { useMutation } from "@tanstack/react-query";

const AI_URL = import.meta.env.VITE_AI_URL;


type ChatbotResponse = {
    thread_id: string;
    message: string;
}

const sendMessage = async (message: string, thread_id?: string): Promise<ChatbotResponse> => {
    const response = await fetch(
        `${AI_URL}/api/chat`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message, thread_id }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to get AI response");
    }

    const data = await response.json() as ChatbotResponse;

    return data
}

export default function useChatbot () {
    return useMutation({
        mutationFn: ({ message, thread_id } : { message: string, thread_id?: string }) => sendMessage(message, thread_id)
    })
}