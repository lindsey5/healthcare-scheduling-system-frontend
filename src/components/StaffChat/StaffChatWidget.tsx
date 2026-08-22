import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    Headset,
    Send,
    X,
} from "lucide-react";

import type { Socket } from "socket.io-client";
import type { PaginationState } from "@tanstack/react-table";

import type {
    ConversationMessage,
    Message,
} from "../../types/conversation.type";

import { cn, timeAgo } from "../../utils/utils";

import useGetStaffConversation from "../../hooks/conversation/use-get-staff-conversation.hook";

interface StaffChatWidgetProps {
    socket: Socket<any> | null;
    conversationId: number;
    handleRemove: (
        conversationId: number
    ) => void;
    handleReadAll: (id: number) => void;
}

export default function StaffChatWidget({
    socket,
    conversationId,
    handleRemove,
    handleReadAll,
}: StaffChatWidgetProps) {
    const [input, setInput] = useState("");

    const [messages, setMessages] = useState<
        ConversationMessage[]
    >([]);

    const [pagination, setPagination] =
        useState<PaginationState>({
            pageSize: 5,
            pageIndex: 0,
        });

    const [isFetchingMore, setIsFetchingMore] =
        useState(false);

    const chatContainerRef =
        useRef<HTMLDivElement | null>(null);

    const messagesEndRef =
        useRef<HTMLDivElement | null>(null);

    const previousScrollHeightRef =
        useRef(0);

    const isLoadingOlderRef =
        useRef(false);

    const shouldScrollToBottom =
        useRef(true);

    /*
     * Keep track of the currently selected
     * conversation.
     *
     * This helps prevent an old request from
     * affecting the newly selected conversation.
     */
    const currentConversationIdRef =
        useRef(conversationId);

    /*
     * Get conversation.
     */
    const {
        data,
        isLoading,
        isFetching,
    } = useGetStaffConversation(
        conversationId,
        {
            page:
                pagination.pageIndex + 1,
            limit:
                pagination.pageSize,
        }
    );

    /*
     * More messages?
     */
    const hasMore = useMemo(() => {
        if (!data) return false;

        return (
            pagination.pageIndex + 1 <
            data.totalPages
        );
    }, [
        data,
        pagination.pageIndex,
    ]);

    /*
     * Patient.
     */
    const patient =
        data?.conversation?.patient;

    const patientName = patient
        ? `${patient.firstname} ${patient.lastname}`
        : "Patient";

    const patientEmail =
        patient?.email ??
        "Patient conversation";

    /*
     * Reset everything whenever the
     * conversation changes.
     */
    useEffect(() => {
        currentConversationIdRef.current =
            conversationId;

        // Clear old conversation messages
        setMessages([]);

        // Reset pagination
        setPagination({
            pageSize: 5,
            pageIndex: 0,
        });

        // Reset loading states
        setIsFetchingMore(false);

        // Reset scroll-related refs
        previousScrollHeightRef.current = 0;
        isLoadingOlderRef.current = false;
        shouldScrollToBottom.current = true;

        // Clear input
        setInput("");

        // Reset scroll position
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = 0;
        }
    }, [conversationId]);

    /*
     * API messages.
     *
     * Important:
     * Only update messages if the response
     * belongs to the currently selected
     * conversation.
     */
    useEffect(() => {
        if (!data) return;

        if (
            currentConversationIdRef.current !==
            conversationId
        ) {
            return;
        }

        const newMessages: ConversationMessage[] =
            data.messages.map(
                (message) => ({
                    message:
                        message.message,
                    createdAt:
                        message.createdAt,
                    senderType:
                        message.senderType,
                })
            );

        /*
         * First page.
         *
         * Replace messages instead of appending.
         */
        if (
            pagination.pageIndex === 0
        ) {
            shouldScrollToBottom.current =
                true;

            setMessages(
                newMessages
            );
        } else {
            /*
             * Older page.
             *
             * Add older messages to the
             * beginning.
             */
            shouldScrollToBottom.current =
                false;

            setMessages((prev) => [
                ...newMessages,
                ...prev,
            ]);
        }

        setIsFetchingMore(false);

        isLoadingOlderRef.current =
            false;
    }, [
        data,
        pagination.pageIndex,
        conversationId,
    ]);

    /*
     * Scroll to bottom when the first page
     * or a new message is loaded.
     */
    useEffect(() => {
        if (
            !shouldScrollToBottom.current ||
            messages.length === 0
        ) {
            return;
        }

        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView(
                {
                    behavior: "smooth",
                }
            );
        });
    }, [messages]);

    /*
     * Preserve scroll position when
     * loading older messages.
     */
    useEffect(() => {
        const container =
            chatContainerRef.current;

        if (!container) return;

        /*
         * First page.
         */
        if (
            pagination.pageIndex === 0
        ) {
            if (messages.length > 0) {
                requestAnimationFrame(() => {
                    container.scrollTop =
                        container.scrollHeight;
                });
            }

            return;
        }

        /*
         * Don't restore the position while
         * the older messages are still loading.
         */
        if (isFetchingMore) return;

        const previousHeight =
            previousScrollHeightRef.current;

        if (previousHeight <= 0) {
            return;
        }

        const newHeight =
            container.scrollHeight;

        const difference =
            newHeight -
            previousHeight;

        /*
         * Preserve the user's position.
         */
        container.scrollTop =
            difference;

        previousScrollHeightRef.current =
            0;
    }, [
        messages,
        pagination.pageIndex,
        isFetchingMore,
    ]);

    /*
     * Load older messages.
     */
    const handleScroll = () => {
        const container =
            chatContainerRef.current;

        if (!container) return;

        /*
         * Only load older messages when
         * the user reaches the top.
         */
        if (container.scrollTop > 5) {
            return;
        }

        if (
            isLoading ||
            isFetching ||
            isLoadingOlderRef.current ||
            isFetchingMore ||
            !hasMore
        ) {
            return;
        }

        isLoadingOlderRef.current =
            true;

        setIsFetchingMore(true);

        shouldScrollToBottom.current =
            false;

        /*
         * Save current height before
         * loading older messages.
         */
        previousScrollHeightRef.current =
            container.scrollHeight;

        setPagination((prev) => ({
            ...prev,
            pageIndex:
                prev.pageIndex + 1,
        }));
    };

    /*
     * Socket listeners.
     */
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (
            message: Message
        ) => {
            /*
             * Ignore messages belonging
             * to another conversation.
             */
            if (
                message.conversationId !==
                conversationId
            ) {
                return;
            }

            /*
             * Make sure this is still
             * the active conversation.
             */
            if (
                currentConversationIdRef.current !==
                conversationId
            ) {
                return;
            }

            const newMessage: ConversationMessage =
                {
                    message:
                        message.message,
                    createdAt:
                        message.createdAt,
                    senderType:
                        message.senderType,
                };

            shouldScrollToBottom.current =
                true;

            setMessages((prev) => [
                ...prev,
                newMessage,
            ]);
        };

        socket.on(
            "message:new",
            handleNewMessage
        );

        return () => {
            socket.off(
                "message:new",
                handleNewMessage
            );
        };
    }, [
        socket,
        conversationId,
    ]);

    /*
     * Send message.
     */
    const sendMessage = () => {
        if (
            !socket ||
            !input.trim()
        ) {
            return;
        }

        const message =
            input.trim();

        const optimisticMessage: ConversationMessage =
            {
                message,
                createdAt:
                    new Date().toISOString(),
                senderType: "Staff",
            };

        shouldScrollToBottom.current =
            true;

        setMessages((prev) => [
            ...prev,
            optimisticMessage,
        ]);

        socket.emit(
            "message:send",
            {
                conversationId,
                message,
                senderType: "Staff",
            }
        );

        setInput("");
    };

    /*
     * Enter key.
     */
    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {
            e.preventDefault();

            sendMessage();
        }
    };

    /*
     * End conversation.
     */
    const endConversation = () => {
        if (!socket) return;

        socket.emit(
            "conversation:end",
            conversationId
        );

        handleRemove(
            conversationId
        );
    };

    return (
        <div className="flex h-full min-w-0 flex-col bg-white">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                    {/* Avatar */}
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <Headset size={20} />

                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                    </div>

                    {/* Patient information */}
                    <div className="min-w-0">
                        <h2 className="truncate text-sm font-semibold text-gray-800">
                            {patientName}
                        </h2>

                        <p className="truncate text-xs text-gray-400">
                            {patientEmail}
                        </p>
                    </div>
                </div>
            </div>

            {/* Active status */}
            <div className="flex shrink-0 items-center gap-2 border-b border-gray-100 px-5 py-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                <span className="text-[11px] font-medium text-gray-500">
                    Active conversation
                </span>
            </div>

            {/* Messages */}
            <div
                ref={
                    chatContainerRef
                }
                onScroll={
                    handleScroll
                }
                className="min-h-0 flex-1 overflow-y-auto bg-gray-50 px-5 py-5"
            >
                {messages.length >
                0 ? (
                    <>
                        {isFetchingMore && (
                            <div className="mb-4 text-center text-[11px] text-gray-400">
                                Loading older
                                messages...
                            </div>
                        )}

                        <div className="space-y-4">
                            {messages.map(
                                (
                                    message,
                                    index
                                ) => {
                                    const isStaff =
                                        message.senderType ===
                                        "Staff";

                                    return (
                                        <div
                                            key={`${message.createdAt}-${index}`}
                                            className={cn(
                                                "flex",
                                                isStaff
                                                    ? "justify-end"
                                                    : "justify-start"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "max-w-[75%]",
                                                    isStaff
                                                        ? "items-end"
                                                        : "items-start"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                                                        isStaff
                                                            ? "rounded-br-md bg-green-600 text-white"
                                                            : "rounded-bl-md border border-gray-200 bg-white text-gray-700"
                                                    )}
                                                >
                                                    {
                                                        message.message
                                                    }
                                                </div>

                                                <p
                                                    className={cn(
                                                        "mt-1 px-1 text-[10px] text-gray-400",
                                                        isStaff &&
                                                            "text-right"
                                                    )}
                                                >
                                                    {timeAgo(
                                                        message.createdAt
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <Headset
                                size={24}
                            />
                        </div>

                        <h3 className="text-sm font-semibold text-gray-700">
                            {isLoading
                                ? "Loading conversation..."
                                : "Start a conversation"}
                        </h3>

                        {!isLoading && (
                            <p className="mt-1 max-w-xs text-xs text-gray-400">
                                Send a message to{" "}
                                <span className="font-medium text-gray-500">
                                    {patientName}
                                </span>
                                .
                            </p>
                        )}
                    </div>
                )}

                <div
                    ref={
                        messagesEndRef
                    }
                />
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-gray-200 bg-white p-4">
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 transition focus-within:border-green-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-100">
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
                        onFocus={() =>
                            handleReadAll(
                                conversationId
                            )
                        }
                        placeholder="Type a message..."
                        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                    />

                    <button
                        type="button"
                        onClick={
                            sendMessage
                        }
                        disabled={
                            !input.trim()
                        }
                        className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition",
                            input.trim()
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "cursor-not-allowed bg-gray-200 text-gray-400"
                        )}
                    >
                        <Send
                            size={16}
                        />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={
                        endConversation
                    }
                    className="mt-2 flex w-full items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-red-500 transition hover:text-red-600"
                >
                    <X size={13} />
                    End conversation
                </button>
            </div>
        </div>
    );
}