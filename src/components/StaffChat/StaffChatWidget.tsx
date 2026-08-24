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
            pageSize: 20,
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
         * older messages are loading.
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
         * Preserve user's position.
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
        <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-white">
            {/* =========================
                HEADER
            ========================== */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-3 py-3 sm:px-4 sm:py-4 md:px-5">
                <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
                    {/* Avatar */}
                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 sm:h-10 sm:w-10 md:h-11 md:w-11">
                        <Headset
                            size={18}
                            className="sm:h-5 sm:w-5"
                        />

                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500 sm:h-3 sm:w-3" />
                    </div>

                    {/* Patient information */}
                    <div className="min-w-0 flex-1">
                        <h2 className="truncate text-xs font-semibold text-gray-800 sm:text-sm">
                            {patientName}
                        </h2>

                        <p className="truncate text-[10px] text-gray-400 sm:text-xs">
                            {patientEmail}
                        </p>
                    </div>
                </div>
            </div>

            {/* =========================
                ACTIVE STATUS
            ========================== */}
            <div className="flex shrink-0 items-center gap-1.5 border-b border-gray-100 px-3 py-2 sm:gap-2 sm:px-4 sm:py-2.5 md:px-5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />

                <span className="text-[10px] font-medium text-gray-500 sm:text-[11px]">
                    Active conversation
                </span>
            </div>

            {/* =========================
                MESSAGES
            ========================== */}
            <div
                ref={
                    chatContainerRef
                }
                onScroll={
                    handleScroll
                }
                className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 px-3 py-4 sm:px-4 sm:py-5 md:px-5"
            >
                {messages.length >
                0 ? (
                    <>
                        {/* Loading older messages */}
                        {isFetchingMore && (
                            <div className="mb-3 text-center text-[10px] text-gray-400 sm:mb-4 sm:text-[11px]">
                                Loading older
                                messages...
                            </div>
                        )}

                        <div className="space-y-3 sm:space-y-4">
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
                                                "flex min-w-0",
                                                isStaff
                                                    ? "justify-end"
                                                    : "justify-start"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "flex min-w-0 flex-col",
                                                    isStaff
                                                        ? "items-end"
                                                        : "items-start",
                                                    "max-w-[88%] sm:max-w-[80%] md:max-w-[75%]"
                                                )}
                                            >
                                                {/* Message */}
                                                <div
                                                    className={cn(
                                                        "break-words rounded-2xl px-3 py-2 text-xs leading-relaxed sm:px-4 sm:py-2.5 sm:text-sm",
                                                        isStaff
                                                            ? "rounded-br-md bg-green-600 text-white"
                                                            : "rounded-bl-md border border-gray-200 bg-white text-gray-700"
                                                    )}
                                                >
                                                    {
                                                        message.message
                                                    }
                                                </div>

                                                {/* Time */}
                                                <p
                                                    className={cn(
                                                        "mt-1 px-1 text-[9px] text-gray-400 sm:text-[10px]",
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
                    /* =========================
                       EMPTY STATE
                    ========================== */
                    <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 sm:mb-4 sm:h-14 sm:w-14">
                            <Headset
                                size={22}
                                className="sm:h-6 sm:w-6"
                            />
                        </div>

                        <h3 className="text-xs font-semibold text-gray-700 sm:text-sm">
                            {isLoading
                                ? "Loading conversation..."
                                : "Start a conversation"}
                        </h3>

                        {!isLoading && (
                            <p className="mt-1 max-w-[250px] text-[10px] leading-relaxed text-gray-400 sm:max-w-xs sm:text-xs">
                                Send a message to{" "}
                                <span className="font-medium text-gray-500">
                                    {patientName}
                                </span>
                                .
                            </p>
                        )}
                    </div>
                )}

                {/* Scroll target */}
                <div
                    ref={
                        messagesEndRef
                    }
                />
            </div>

            {/* =========================
                INPUT
            ========================== */}
            <div className="shrink-0 border-t border-gray-200 bg-white px-3 py-3 sm:px-4 sm:py-4">
                {/* Input container */}
                <div className="flex min-w-0 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-2 transition focus-within:border-green-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-100 sm:px-3">
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
                        className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-gray-400 sm:text-sm"
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
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition sm:h-9 sm:w-9",
                            input.trim()
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "cursor-not-allowed bg-gray-200 text-gray-400"
                        )}
                    >
                        <Send
                            size={14}
                            className="sm:h-4 sm:w-4"
                        />
                    </button>
                </div>

                {/* End conversation */}
                <button
                    type="button"
                    onClick={
                        endConversation
                    }
                    className="mt-1.5 flex min-h-[32px] w-full items-center justify-center gap-1.5 py-1.5 text-[10px] font-medium text-red-500 transition hover:text-red-600 sm:mt-2 sm:text-xs"
                >
                    <X
                        size={12}
                        className="sm:h-[13px] sm:w-[13px]"
                    />

                    End conversation
                </button>
            </div>
        </div>
    );
}