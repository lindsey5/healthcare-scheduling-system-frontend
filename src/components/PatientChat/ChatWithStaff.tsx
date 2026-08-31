import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { Headset, Send, User } from "lucide-react";
import type { PaginationState } from "@tanstack/react-table";
import type { Socket } from "socket.io-client";
import type { ConversationMessage, Message } from "../../types/conversation.type";
import { cn, errorToast, timeAgo } from "../../utils/utils";
import Button from "../ui/Button";
import useGetPatientConversation from "../../hooks/conversation/use-get-patient-conversation.hook";

interface ChatWithStaffProps {
    socket: Socket<any> | null;
    setUnread: Dispatch<SetStateAction<number>>;
    messages: ConversationMessage[];
    setMessages: Dispatch<SetStateAction<ConversationMessage[]>>;
    handleReadAll: () => void;
}

export default function ChatWithStaff({
    socket,
    setUnread,
    messages,
    setMessages,
    handleReadAll,
}: ChatWithStaffProps) {
    const [input, setInput] = useState("");
    const [status, setStatus] = useState<"active" | "waiting" | "ended">("waiting");
    const [pagination, setPagination] = useState<PaginationState>({
        pageSize: 10,
        pageIndex: 0,
    });
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const topRef = useRef<HTMLDivElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const previousScrollHeightRef = useRef(0);
    const shouldScrollToBottomRef = useRef(true);

    const { data, isLoading, isFetching } = useGetPatientConversation({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    });

    const hasMore = data
        ? pagination.pageIndex + 1 < data.totalPages
        : false;

    const patientName = data?.conversation?.patient
        ? `${data.conversation.patient.firstname} ${data.conversation.patient.lastname}`
        : "Staff";

    useEffect(() => {
        if (!shouldScrollToBottomRef.current || !messages.length) return;

        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth",
            });
            shouldScrollToBottomRef.current = false;
        });
    }, [messages]);

    useEffect(() => {
        const target = topRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting || isLoading || isFetching || isFetchingMore || !hasMore) {
                return;
            }

            const container = chatContainerRef.current;
            if (!container) return;

            previousScrollHeightRef.current = container.scrollHeight;
            setIsFetchingMore(true);

            setPagination(prev => ({
                ...prev,
                pageIndex: prev.pageIndex + 1,
            }));
        });

        observer.observe(target);

        return () => observer.disconnect();
    }, [isLoading, isFetching, isFetchingMore, hasMore]);

    useEffect(() => {
        if (!data) return;

        if (data.conversation.status === "Active" && data.conversation.assignedStaffId !== null) {
            setStatus("active");
        }

        const newMessages: ConversationMessage[] = data.messages.map(message => ({
            message: message.message,
            createdAt: message.createdAt,
            senderType: message.senderType,
        }));

        if (pagination.pageIndex === 0) {
            shouldScrollToBottomRef.current = true;
            setMessages(newMessages);
        } else {
            shouldScrollToBottomRef.current = false;
            setMessages(prev => [...newMessages, ...prev]);
        }

        setIsFetchingMore(false);
    }, [data, pagination.pageIndex, setMessages]);

    useEffect(() => {
        if (pagination.pageIndex === 0 || isFetchingMore) return;

        const container = chatContainerRef.current;
        if (!container) return;

        const previousHeight = previousScrollHeightRef.current;
        if (!previousHeight) return;

        const newHeight = container.scrollHeight;
        container.scrollTop = newHeight - previousHeight;
        previousScrollHeightRef.current = 0;
    }, [messages, pagination.pageIndex, isFetchingMore]);

    useEffect(() => {
        if (!socket) return;

        const handleConversationStatus = (hasAvailable: boolean) => {
            if (hasAvailable) {
                setStatus("active");
            } else {
                errorToast("Failed", "No Available Staff, Please try again later");
            }
        };

        const handleNewMessage = (message: Message) => {
            setUnread(prev => prev + 1);
            shouldScrollToBottomRef.current = true;

            setMessages(prev => [
                ...prev,
                {
                    message: message.message,
                    createdAt: message.createdAt,
                    senderType: message.senderType,
                },
            ]);
        };

        const handleEndConversation = () => {
            setStatus("ended");
        };

        socket.on("conversation:status", handleConversationStatus);
        socket.on("message:new", handleNewMessage);
        socket.on("conversation:end", handleEndConversation);

        return () => {
            socket.off("conversation:status", handleConversationStatus);
            socket.off("message:new", handleNewMessage);
            socket.off("conversation:end", handleEndConversation);
        };
    }, [socket, setMessages, setUnread]);

    const handleStart = () => {
        socket?.emit("conversation:start");
    };

    const endConversation = () => {
        if (!socket || !data?.conversation) return;

        socket.emit("conversation:end", data.conversation.id);
        setStatus("ended");
    };

    const sendMessage = () => {
        if (!input.trim() || !data?.conversation) return;

        const message = input.trim();

        handleReadAll();
        shouldScrollToBottomRef.current = true;

        setMessages(prev => [
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            <div ref={chatContainerRef} className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-4">
                <div ref={topRef} className="h-1 w-full" />

                {isFetchingMore && (
                    <div className="py-2 text-center text-xs text-gray-400">
                        Loading older messages...
                    </div>
                )}

                {!hasMore && messages.length > 0 && (
                    <div className="py-2 text-center text-[10px] text-gray-400">
                        Beginning of conversation
                    </div>
                )}

                <div className="space-y-4">
                    {messages.map((message, index) => {
                        const isPatient = message.senderType === "Patient";

                        return (
                            <div
                                key={`${message.createdAt}-${index}`}
                                className={cn(
                                    "flex gap-2",
                                    isPatient ? "justify-end" : "justify-start"
                                )}
                            >
                                {!isPatient && (
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                                        <Headset size={17} />
                                    </div>
                                )}

                                <div
                                    className={cn(
                                        "max-w-[75%] rounded-2xl px-4 py-3 text-sm",
                                        isPatient
                                            ? "rounded-br-md bg-green-600 text-white"
                                            : "rounded-bl-md border border-gray-200 bg-white text-gray-700"
                                    )}
                                >
                                    <p className="break-words">{message.message}</p>
                                    <p className={cn(
                                        "mt-1 text-xs",
                                        isPatient ? "text-green-100" : "text-gray-400"
                                    )}>
                                        {timeAgo(message.createdAt)}
                                    </p>
                                </div>

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

            <div className="border-t bg-white p-3">
                {status !== "active" ? (
                    <>
                        <Button disabled={isLoading} className="w-full" onClick={handleStart}>
                            Start Conversation
                        </Button>

                        {status === "ended" && (
                            <p className="mt-1 text-center text-sm text-gray-500">
                                Conversation has been ended
                            </p>
                        )}
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-2 rounded-xl border border-gray-500 px-3 py-2 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onFocus={handleReadAll}
                                onKeyDown={handleKeyDown}
                                placeholder={`Message ${patientName}...`}
                                className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                            />

                            <button
                                type="button"
                                onClick={sendMessage}
                                disabled={!input.trim()}
                                className={cn(
                                    "flex h-9 w-9 items-center justify-center rounded-lg text-white transition",
                                    input.trim()
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "cursor-not-allowed bg-gray-300"
                                )}
                            >
                                <Send size={17} />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={endConversation}
                            className="mb-2 mt-3 w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                        >
                            End Conversation
                        </button>
                    </>
                )}
            </div>
        </>
    );
}