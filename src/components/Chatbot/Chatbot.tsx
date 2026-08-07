import { useEffect, useRef, useState } from "react";
import {
    Bot,
    Send,
    X,
    MessageCircle,
    User,
    Loader2,
} from "lucide-react";
import { cn } from "../../utils/utils";
import useChatbot from "../../hooks/chatbot/use-chatbot.hook";

interface Message {
    id: number;
    role: "user" | "assistant";
    content: string;
}

export default function Chatbot() {
    const chatbotMutation = useChatbot();

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            role: "assistant",
            content:
                "Hello! I'm the Bagumbayan Health Center AI Assistant. How can I help you today?",
        },
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, chatbotMutation.isPending]);

    const sendMessage = async () => {
        const message = input.trim();

        if (!message || chatbotMutation.isPending) return;

        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(),
                role: "user",
                content: message,
            },
        ]);

        setInput("");

        try {
            const response = await chatbotMutation.mutateAsync(message);

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "assistant",
                    content:
                        response.message ??
                        "Sorry, I wasn't able to process your request.",
                },
            ]);
        } catch (error) {
            console.error("Chat error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "assistant",
                    content:
                        "Sorry, I'm having trouble connecting to the AI service right now.",
                },
            ]);
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Chat Window */}
            <div
                className={cn(
                    "fixed bottom-24 right-6 z-50 flex h-[600px] w-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl",
                    !isOpen && "hidden"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between bg-green-600 px-5 py-4 text-white">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                            <Bot size={22} />
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Health Assistant
                            </h3>

                            <div className="flex items-center gap-1 text-xs text-green-100">
                                <span className="h-2 w-2 rounded-full bg-green-300" />
                                AI Assistant
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="rounded-lg p-2 transition hover:bg-white/10"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
                    {messages.map((message) => {
                        const isUser = message.role === "user";

                        return (
                            <div
                                key={message.id}
                                className={cn(
                                    "flex gap-2",
                                    isUser
                                        ? "justify-end"
                                        : "justify-start"
                                )}
                            >
                                {!isUser && (
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                                        <Bot size={17} />
                                    </div>
                                )}

                                <div
                                    className={cn(
                                        "max-w-[75%] rounded-2xl px-4 py-3 text-sm",
                                        isUser
                                            ? "rounded-br-md bg-green-600 text-white"
                                            : "rounded-bl-md border border-gray-200 bg-white text-gray-700"
                                    )}
                                >
                                    {message.content}
                                </div>

                                {isUser && (
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                                        <User size={17} />
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {chatbotMutation.isPending && (
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <Bot size={17} />
                            </div>

                            <div className="rounded-2xl rounded-bl-md border border-gray-200 bg-white px-4 py-3">
                                <Loader2
                                    size={18}
                                    className="animate-spin text-green-600"
                                />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t bg-white p-3">
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) =>
                                setInput(e.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about health services..."
                            disabled={chatbotMutation.isPending}
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                        />

                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || chatbotMutation.isPending}
                            className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-lg text-white transition",
                                input.trim() && !chatbotMutation.isPending
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "cursor-not-allowed bg-gray-300"
                            )}
                        >
                            <Send size={17} />
                        </button>
                    </div>

                    <p className="mt-2 text-center text-[10px] text-gray-400">
                        AI responses may not always be accurate.
                    </p>
                </div>
            </div>

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className={cn(
                    "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition hover:scale-105 hover:bg-green-700",
                    isOpen && "bg-gray-700 hover:bg-gray-800"
                )}
                aria-label={
                    isOpen
                        ? "Close AI Assistant"
                        : "Open AI Assistant"
                }
            >
                {isOpen ? (
                    <X size={25} />
                ) : (
                    <MessageCircle size={25} />
                )}
            </button>
        </>
    );
}