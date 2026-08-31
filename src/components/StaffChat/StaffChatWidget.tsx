import { useEffect, useMemo, useRef, useState } from "react";
import { Headset, Send, X } from "lucide-react";
import type { Socket } from "socket.io-client";
import type { PaginationState } from "@tanstack/react-table";
import type { ConversationMessage, Message } from "../../types/conversation.type";
import { cn, timeAgo } from "../../utils/utils";
import useGetStaffConversation from "../../hooks/conversation/use-get-staff-conversation.hook";

interface StaffChatWidgetProps {
    socket: Socket<any> | null;
    conversationId: number;
    handleRemove: (conversationId: number) => void;
    handleReadAll: (id: number) => void;
}

export default function StaffChatWidget({
    socket,
    conversationId,
    handleRemove,
    handleReadAll,
}: StaffChatWidgetProps) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<ConversationMessage[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageSize: 5,
        pageIndex: 0,
    });
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const topSentinelRef = useRef<HTMLDivElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const currentConversationIdRef = useRef(conversationId);
    const shouldScrollToBottom = useRef(true);
    const previousFirstMessageRef = useRef<ConversationMessage | null>(null);

    const { data, isLoading, isFetching } = useGetStaffConversation(conversationId, {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    });

    const hasMore = useMemo(() => {
        if (!data) return false;
        return pagination.pageIndex + 1 < data.totalPages;
    }, [data, pagination.pageIndex]);

    const patient = data?.conversation?.patient;
    const patientName = patient ? `${patient.firstname} ${patient.lastname}` : "Patient";
    const patientInitials = patient
        ? `${patient.firstname?.[0] ?? ""}${patient.lastname?.[0] ?? ""}`.toUpperCase()
        : "P";

    useEffect(() => {
        currentConversationIdRef.current = conversationId;
        setMessages([]);
        setPagination({ pageSize: 5, pageIndex: 0 });
        setInput("");
        setIsFetchingMore(false);
        shouldScrollToBottom.current = true;
        previousFirstMessageRef.current = null;

        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = 0;
        }
    }, [conversationId]);

    useEffect(() => {
        if (!data || currentConversationIdRef.current !== conversationId) return;

        const newMessages: ConversationMessage[] = data.messages.map(message => ({
            message: message.message,
            createdAt: message.createdAt,
            senderType: message.senderType,
        }));

        if (pagination.pageIndex === 0) {
            setMessages(newMessages);
            shouldScrollToBottom.current = true;
            setIsFetchingMore(false);
            return;
        }

        setMessages(prev => [...newMessages, ...prev]);
        setIsFetchingMore(false);
    }, [data, pagination.pageIndex, conversationId]);

    useEffect(() => {
        if (!messages.length || !shouldScrollToBottom.current) return;

        requestAnimationFrame(() => {
            const container = chatContainerRef.current;
            if (!container) return;

            container.scrollTop = container.scrollHeight;
            shouldScrollToBottom.current = false;
        });
    }, [messages]);

    useEffect(() => {
        const previousMessage = previousFirstMessageRef.current;
        if (!previousMessage) return;

        const container = chatContainerRef.current;
        if (!container) return;

        requestAnimationFrame(() => {
            const key = `${previousMessage.createdAt}-${previousMessage.message}`;
            const target = container.querySelector(`[data-message="${CSS.escape(key)}"]`);

            if (target instanceof HTMLElement) {
                target.scrollIntoView({
                    block: "start",
                    behavior: "auto",
                });
            }

            previousFirstMessageRef.current = null;
        });
    }, [messages]);

    useEffect(() => {
        const sentinel = topSentinelRef.current;
        const container = chatContainerRef.current;

        if (!sentinel || !container) return;

        const observer = new IntersectionObserver(
            entries => {
                if (
                    !entries[0].isIntersecting ||
                    !hasMore ||
                    isFetching ||
                    isFetchingMore
                ) {
                    return;
                }

                if (messages.length > 0) {
                    previousFirstMessageRef.current = messages[0];
                }

                shouldScrollToBottom.current = false;
                setIsFetchingMore(true);

                setPagination(prev => ({
                    ...prev,
                    pageIndex: prev.pageIndex + 1,
                }));
            },
            {
                root: container,
                threshold: 0.1,
            }
        );

        observer.observe(sentinel);

        return () => observer.disconnect();
    }, [hasMore, isFetching, isFetchingMore, messages]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message: Message) => {
            if (
                message.conversationId !== conversationId ||
                currentConversationIdRef.current !== conversationId
            ) {
                return;
            }

            setMessages(prev => [
                ...prev,
                {
                    message: message.message,
                    createdAt: message.createdAt,
                    senderType: message.senderType,
                },
            ]);

            shouldScrollToBottom.current = true;
        };

        socket.on("message:new", handleNewMessage);

        return () => {
            socket.off("message:new", handleNewMessage);
        };
    }, [socket, conversationId]);

    const sendMessage = () => {
        if (!socket || !input.trim()) return;

        const message = input.trim();

        setMessages(prev => [
            ...prev,
            {
                message,
                createdAt: new Date().toISOString(),
                senderType: "Staff",
            },
        ]);

        shouldScrollToBottom.current = true;

        socket.emit("message:send", {
            conversationId,
            message,
            senderType: "Staff",
        });

        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const endConversation = () => {
        if (!socket) return;

        socket.emit("conversation:end", conversationId);
        handleRemove(conversationId);
    };

    return (
        <div className="flex h-full min-h-0 flex-col bg-white">
            <div
                ref={chatContainerRef}
                className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 px-4 py-5 sm:px-6"
            >
                <div ref={topSentinelRef} className="h-1" />

                {isFetchingMore && (
                    <div className="mb-4 flex justify-center">
                        <span className="rounded-full bg-white px-3 py-1 text-[10px] text-gray-400 shadow-sm">
                            Loading older messages...
                        </span>
                    </div>
                )}

                {messages.length > 0 ? (
                    <div className="space-y-4">
                        {messages.map((message, index) => {
                            const isStaff = message.senderType === "Staff";
                            const messageKey = `${message.createdAt}-${message.message}`;

                            return (
                                <div
                                    key={`${messageKey}-${index}`}
                                    data-message={messageKey}
                                    className={cn(
                                        "flex items-end gap-2",
                                        isStaff ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {!isStaff && (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-[10px] font-semibold text-green-700">
                                            {patientInitials}
                                        </div>
                                    )}

                                    <div
                                        className={cn(
                                            "flex max-w-[75%] flex-col",
                                            isStaff ? "items-end" : "items-start"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                                                isStaff
                                                    ? "rounded-br-md bg-green-600 text-white"
                                                    : "rounded-bl-md border border-gray-200 bg-white text-gray-700"
                                            )}
                                        >
                                            {message.message}
                                        </div>

                                        <span className="mt-1 px-1 text-[10px] text-gray-400">
                                            {timeAgo(message.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <Headset size={25} />
                        </div>

                        <h3 className="text-sm font-semibold text-gray-700">
                            {isLoading ? "Loading conversation..." : "Start a conversation"}
                        </h3>

                        {!isLoading && (
                            <p className="mt-1 max-w-xs text-xs leading-relaxed text-gray-400">
                                Send a message to{" "}
                                <span className="font-medium text-gray-500">{patientName}</span>.
                            </p>
                        )}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-2 py-2 transition focus-within:border-green-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-100">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => handleReadAll(conversationId)}
                        placeholder="Type a message..."
                        className="min-w-0 flex-1 bg-transparent px-2 text-sm text-gray-700 outline-none placeholder:text-gray-400"
                    />

                    <button
                        type="button"
                        onClick={sendMessage}
                        disabled={!input.trim()}
                        className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition",
                            input.trim()
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "cursor-not-allowed bg-gray-200 text-gray-400"
                        )}
                    >
                        <Send size={16} />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={endConversation}
                    className="mx-auto mt-2 flex items-center gap-1.5 text-[11px] font-medium text-gray-400 transition hover:text-red-500"
                >
                    <X size={13} />
                    End conversation
                </button>
            </div>
        </div>
    );
}