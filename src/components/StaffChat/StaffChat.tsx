import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import { cn, timeAgo } from "../../utils/utils";
import { Headset, MessageCircle, Send, X } from "lucide-react";
import type {
    ConversationMessage,
    Message,
} from "../../types/conversation.type";
import type { PaginationState } from "@tanstack/react-table";
import useGetStaffConversation from "../../hooks/conversation/use-get-staff-conversation.hook";

export default function StaffChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [conversationId, setConversationId] =
        useState<number | null>(null);

    const [input, setInput] = useState("");

    const socket = useSocket({
        namespace: "/conversation",
    });

    const [messages, setMessages] = useState<
        ConversationMessage[]
    >([]);

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
    } = useGetStaffConversation({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    /*
     * Infinite scroll
     */
    useEffect(() => {
        const target = topRef.current;

        if (!target || messages.length === 0) {
            return;
        }

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

        if (data.conversation) {
            setConversationId(data.conversation.id);
        }

        const newMessages: ConversationMessage[] =
            data.messages.map((message) => ({
                id: message.id,
                message: message.message,
                createdAt: message.createdAt,
                senderType: message.senderType,
            }));

        if (pagination.pageIndex === 0) {
            setMessages(newMessages);
        } else {
            // Older messages go before existing messages
            setMessages((prev) => [
                ...newMessages,
                ...prev,
            ]);
        }

        setIsFetchingMore(false);
    }, [data, pagination.pageIndex]);

    /*
     * Socket listeners
     */
    useEffect(() => {
        if (!socket) return;

        const handleNewConversation = (id: number) => {
            setConversationId(id);

            // Reset pagination when a new conversation arrives
            setPagination({
                pageSize: 10,
                pageIndex: 0,
            });

            setMessages([]);
        };

        const handleNewMessage = (message: Message) => {
            setMessages((prev) => [
                ...prev,
                {
                    id: message.id,
                    message: message.message,
                    createdAt: message.createdAt,
                    senderType: message.senderType,
                },
            ]);
        };

        socket.on(
            "conversation:new",
            handleNewConversation
        );

        socket.on(
            "message:new",
            handleNewMessage
        );

        return () => {
            socket.off(
                "conversation:new",
                handleNewConversation
            );

            socket.off(
                "message:new",
                handleNewMessage
            );
        };
    }, [socket]);

    /*
     * Handle input
     */
    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    /*
     * Send message
     */
    const sendMessage = () => {
        if (
            !socket ||
            !conversationId ||
            !input.trim()
        ) {
            return;
        }

        const message = input.trim();

        // Optimistic update
        setMessages((prev) => [
            ...prev,
            {
                message,
                createdAt: new Date().toISOString(),
                senderType: "Staff",
            },
        ]);

        socket.emit("message:send", {
            conversationId,
            message,
            senderType: "Staff"
        });

        setInput("");
    };

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
                            <Headset size={22} />
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                {data?.conversation.patient ? `${data.conversation.patient.firstname} ${data.conversation.patient.lastname}` : 'Patient Support'}
                            </h3>

                            <p className="text-xs text-green-100">
                                {data?.conversation.patient ? 
                                    <p className="text-xs">{data.conversation.patient.email}</p>
                                    :
                                    conversationId
                                    ? "Active conversation"
                                    : "Waiting for a patient"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setIsOpen(false)
                        }
                        className="rounded-lg p-2 transition hover:bg-white/10"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Chat Content */}
                <div className="flex min-h-0 flex-1 flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                        {messages.length > 0 ? (
                            <>
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
                                    {messages.map(
                                        (message, index) => {
                                            const isStaff =
                                                message.senderType ===
                                                "Staff";

                                            return (
                                                <div
                                                    key={index}
                                                    className={cn(
                                                        "flex gap-2",
                                                        isStaff
                                                            ? "justify-end"
                                                            : "justify-start"
                                                    )}
                                                >
                                                    {/* Patient avatar */}
                                                    {!isStaff && (
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                                                            <Headset
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Message */}
                                                    <div
                                                        className={cn(
                                                            "max-w-[75%] rounded-2xl px-4 py-3 text-sm",
                                                            isStaff
                                                                ? "rounded-br-md bg-green-600 text-white"
                                                                : "rounded-bl-md border border-gray-200 bg-white text-gray-700"
                                                        )}
                                                    >
                                                        <p className="break-words">
                                                            {
                                                                message.message
                                                            }
                                                        </p>

                                                        <p
                                                            className={cn(
                                                                "mt-1 text-xs",
                                                                isStaff
                                                                    ? "text-green-100"
                                                                    : "text-gray-400"
                                                            )}
                                                        >
                                                            {timeAgo(message.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </>
                        ) : (
                            /* Empty state */
                            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                                    <MessageCircle size={30} />
                                </div>

                                <h3 className="text-sm font-semibold text-gray-700">
                                    You don't have messages yet
                                </h3>

                                <p className="mt-1 text-xs text-gray-400">
                                    New patient conversations
                                    will appear here.
                                </p>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    {conversationId && (
                        <div className="border-t bg-white p-3">
                            <div className="flex items-center gap-2 rounded-xl border border-gray-500 px-3 py-2 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) =>
                                        setInput(
                                            e.target.value
                                        )
                                    }
                                    onKeyDown={
                                        handleKeyDown
                                    }
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                                />

                                <button
                                    type="button"
                                    onClick={sendMessage}
                                    disabled={
                                        !input.trim()
                                    }
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
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Button */}
            <button
                type="button"
                onClick={() =>
                    setIsOpen((prev) => !prev)
                }
                className={cn(
                    "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition hover:scale-105 hover:bg-green-700",
                    isOpen &&
                        "bg-gray-700 hover:bg-gray-800"
                )}
                aria-label={
                    isOpen
                        ? "Close chat"
                        : "Open chat"
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