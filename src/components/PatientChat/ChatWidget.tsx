import { useEffect, useState } from "react";
import { cn } from "../../utils/utils";
import {
    Bot,
    Headset,
    MessageCircle,
    X,
} from "lucide-react";
import Chatbot from "./Chatbot";
import ChatWithStaff from "./ChatWithStaff";
import { useAuthStore } from "../../lib/store/authStore";
import useGetUnreadMessages from "../../hooks/conversation/use-get-unread-messages.hook";
import useReadAllMessages from "../../hooks/conversation/use-read-all-messages.hook";
import { useSocket } from "../../hooks/useSocket";
import type { ConversationMessage, Message } from "../../types/conversation.type";

type ChatMode = "ai" | "staff";

export default function ChatWidget() {
    const socket = useSocket({ namespace: "/conversation" });
    const [messages, setMessages] = useState<ConversationMessage[]>([]);

    const [unread, setUnread] = useState(0);
    const { user } = useAuthStore();
    const [mode, setMode] = useState<ChatMode>("ai");
    const [isOpen, setIsOpen] = useState(false);
    const { data } = useGetUnreadMessages();
    const readAllMutation = useReadAllMessages();


    const handleOpenChat = () => {
        setIsOpen((prev) => !prev);
    };

    const handleStaffMode = async () => {
        setMode("staff");

        handleReadAll();
    };

    const handleReadAll = () => {
         // Clear unread messages when switching to staff chat
        setUnread(0);
        readAllMutation.mutateAsync()
    }

    useEffect(() => {
        if(!data) return;

        setUnread(data.unread);
    }, [data]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message: Message) => {
            setUnread(prev => prev + 1);
            setMessages((prev) => [
                ...prev,
                {
                    message: message.message,
                    createdAt: message.createdAt,
                    senderType: message.senderType,
                },
            ]);
        };

        socket.on("message:new", handleNewMessage);

        return () => {
            socket.off("message:new");
        };
    }, [socket]);

    return (
        <>
            {/* Chat Window */}
            <div
                className={cn(
                    "fixed bottom-24 right-6 z-50 flex h-[70vh] max-h-[600px] w-[90vw] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl md:w-[380px]",
                    !isOpen && "hidden"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between bg-green-600 px-5 py-4 text-white">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                            {mode === "ai" ? (
                                <Bot size={22} />
                            ) : (
                                <Headset size={22} />
                            )}
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                {mode === "ai"
                                    ? "Health Assistant"
                                    : "Health Center Staff"}
                            </h3>

                            <div className="flex items-center gap-1 text-xs text-green-100">
                                <span className="h-2 w-2 rounded-full bg-green-300" />

                                {mode === "ai"
                                    ? "AI Assistant"
                                    : "Staff Support"}
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

                {/* Mode Switch */}
                <div className="border-b bg-white p-2">
                    <div className="flex rounded-xl bg-gray-100 p-1">
                        <button
                            onClick={() => setMode("ai")}
                            className={cn(
                                "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                                mode === "ai"
                                    ? "bg-white text-green-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <Bot size={16} />
                            AI Assistant
                        </button>

                        {user && (
                            <button
                                onClick={handleStaffMode}
                                className={cn(
                                    "relative flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                                    mode === "staff"
                                        ? "bg-white text-green-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                <Headset size={16} />
                                Staff

                                {/* Staff unread badge */}
                                {unread > 0 && (
                                    <span className="absolute right-2 top-1 flex min-w-5 h-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                                        {unread > 99 ? "99+" : unread}
                                    </span>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex min-h-0 flex-1 flex-col">
                    {mode === "ai" ? (
                        <Chatbot />
                    ) : (
                        <ChatWithStaff 
                            messages={messages}
                            setMessages={setMessages}
                            setUnread={setUnread} 
                            socket={socket}
                            handleReadAll={handleReadAll}
                        
                        />
                    )}
                </div>
            </div>

            {/* Floating Button */}
            <button
                onClick={handleOpenChat}
                className={cn(
                    "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition hover:scale-105 hover:bg-green-700",
                    isOpen && "bg-gray-700 hover:bg-gray-800"
                )}
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                {isOpen ? (
                    <X size={25} />
                ) : (
                    <>
                        <MessageCircle size={25} />

                        {/* Unread badge */}
                        {unread > 0 && (
                            <span className="absolute -right-1 -top-1 flex min-w-6 h-6 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white shadow-md">
                                {unread > 99 ? "99+" : unread}
                            </span>
                        )}
                    </>
                )}
            </button>
        </>
    );
}