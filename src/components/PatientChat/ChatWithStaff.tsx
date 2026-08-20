import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import { cn, errorToast, timeAgo } from "../../utils/utils";
import { Headset, Send, User } from "lucide-react";
import Button from "../ui/Button";
import type { ConversationMessage, Message } from "../../types/conversation.type";
import useGetPatientConversation from "../../hooks/conversation/use-get-patient-conversation.hook";
import type { PaginationState } from "@tanstack/react-table";

export default function ChatWithStaff() {
    const [input, setInput] = useState("");

    const [status, setStatus] = useState<"active" | "waiting" | "ended">("waiting");

    const socket = useSocket({ namespace: "/conversation" });

    const [messages, setMessages] = useState<ConversationMessage[]>([]);

    const [pagination, setPagination] =
        useState<PaginationState>({
            pageSize: 10,
            pageIndex: 0,
        });

    const [isFetchingMore, setIsFetchingMore] =
        useState(false);

    const topRef = useRef<HTMLDivElement | null>(null);

    const {
        data,
        isLoading,
        isFetching,
    } = useGetPatientConversation({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    useEffect(() => {
        const target = topRef.current;

        if (!target) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (
                    !entry.isIntersecting ||
                    isLoading ||
                    isFetching ||
                    isFetchingMore
                ) {
                    return;
                }

                // Stop if all messages have been loaded
                if (
                    data?.total !== undefined &&
                    messages.length >= data.total
                ) {
                    return;
                }

                setIsFetchingMore(true);

                setPagination((prev) => ({
                    ...prev,
                    pageIndex: prev.pageIndex + 1,
                }));
            },
            {
                threshold: 0.1,
            }
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [
        isLoading,
        isFetching,
        isFetchingMore,
        data?.total,
        messages.length,
    ]);

    /*
     * Handle API messages
     */
    useEffect(() => {
        if (!data) return;

        if (data.conversation.status === "Active" && data.conversation.assignedStaffId !== null) {
            setStatus("active");
        }

        if (data.conversation.status === "Closed") {
            setStatus("ended");
        }

        const newMessages: ConversationMessage[] =
            data.messages.map((message) => ({
                message: message.message,
                createdAt: message.createdAt,
                senderType: message.senderType,
            }));

        if (pagination.pageIndex === 0) {
            setMessages(newMessages);
        } else {
            setMessages((prev) => [
                ...newMessages,
                ...prev,
            ]);
        }

        setIsFetchingMore(false);
    }, [data, pagination.pageIndex]);


    useEffect(() => {
        if (!socket) return;

        const handleConversationStatus = (
            hasAvailable: boolean
        ) => {
            if (hasAvailable) {
                setStatus("active");
            } else {
                errorToast(
                    "Failed",
                    "No Available Staff, Please try again later"
                );
            }
        };

        const handleNewMessage = (message: Message) => {
            setMessages((prev) => [
                ...prev,
                {
                    message: message.message,
                    createdAt: message.createdAt,
                    senderType: message.senderType,
                },
            ]);
        };

        socket.on("conversation:status", handleConversationStatus);

        socket.on("message:new", handleNewMessage);

        return () => {
            socket.off(
                "conversation:status",
                handleConversationStatus
            );

            socket.off(
                "message:new",
                handleNewMessage
            );
        };
    }, [socket]);

    /*
     * Start conversation
     */
    const handleStart = () => {
        socket?.emit("conversation:start");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            sendMessage();
        }
    };

    const sendMessage = () => {
        if (!input.trim() || !data?.conversation) {
            return;
        }

        const message = input.trim();

        setMessages((prev) => [
            ...prev,
            {
                message,
                createdAt: new Date().toISOString(),
                senderType: "Patient",
            },
        ]);

        socket?.emit("message:send", {
            conversationId: data.conversation.id,
            message,
            senderType: "Patient",
        });

        setInput("");
    };

    return (
        <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                {/* Infinite scroll trigger */}
                <div
                    ref={topRef}
                    className="h-1"
                />

                {/* Loading older messages */}
                {isFetchingMore && (
                    <div className="py-2 text-center text-xs text-gray-400">
                        Loading older messages...
                    </div>
                )}

                <div className="space-y-4">
                    {messages.map((message, index) => {
                        const isPatient =
                            message.senderType === "Patient";

                        return (
                            <div
                                key={index}
                                className={cn(
                                    "flex gap-2",
                                    isPatient
                                        ? "justify-end"
                                        : "justify-start"
                                )}
                            >
                                {/* Staff avatar */}
                                {!isPatient && (
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                                        <Headset size={17} />
                                    </div>
                                )}

                                {/* Message */}
                                <div
                                    className={cn(
                                        "max-w-[75%] rounded-2xl px-4 py-3 text-sm",
                                        isPatient
                                            ? "rounded-br-md bg-green-600 text-white"
                                            : "rounded-bl-md border border-gray-200 bg-white text-gray-700"
                                    )}
                                >
                                    <p className="break-words">
                                        {message.message}
                                    </p>

                                    {/* Created At */}
                                    <p
                                        className={cn(
                                            "mt-1 text-xs",
                                            isPatient
                                                ? "text-green-100"
                                                : "text-gray-400"
                                        )}
                                    >
                                        {timeAgo(message.createdAt)}
                                    </p>
                                </div>

                                {/* Patient avatar */}
                                {isPatient && (
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                                        <User size={17} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="border-t bg-white p-3">
                {status === "waiting" ? (
                    <Button
                        disabled={isLoading}
                        className="w-full"
                        onClick={handleStart}
                    >
                        Start Conversation
                    </Button>
                ) : status === "ended" ? (
                    <p className="text-center text-sm text-gray-500">
                        Conversation has been ended
                    </p>
                ) : (
                    <div className="flex items-center gap-2 rounded-xl border border-gray-500 px-3 py-2 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) =>
                                setInput(e.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="Ask anything..."
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                        />

                        <button
                            type="button"
                            onClick={sendMessage}
                            disabled={!input.trim()}
                            className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-lg text-white transition",
                                !input.trim()
                                    ? "cursor-not-allowed bg-gray-300"
                                    : "bg-green-600 hover:bg-green-700"
                            )}
                        >
                            <Send size={17} />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}