import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCheck, MoreVertical } from "lucide-react";
import type { PaginationState } from "@tanstack/react-table";
import useGetConversationById from "../../../hooks/conversation/use-get-conversation.hook";
import { cn, timeAgo } from "../../../utils/utils";

interface ChatPanelProps {
    conversationId: number;
}

export default function ChatPanel({ conversationId }: ChatPanelProps) {
    const [pagination, setPagination] = useState<PaginationState>({
        pageSize: 5,
        pageIndex: 0,
    });
    const [messages, setMessages] = useState<any[]>([]);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const topObserverRef = useRef<HTMLDivElement | null>(null);
    const previousFirstMessageRef = useRef<any | null>(null);

    const { data, isLoading, isFetching } = useGetConversationById(
        conversationId,
        {
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
        }
    );

    const hasMore = useMemo(() => {
        if (!data) return false;
        return pagination.pageIndex + 1 < data.totalPages;
    }, [data, pagination.pageIndex]);

    const patient = data?.conversation?.patient;

    const patientName = patient
        ? `${patient.firstname} ${patient.lastname}`
        : "Patient";

    const patientInitials = patient
        ? `${patient.firstname?.[0] ?? ""}${patient.lastname?.[0] ?? ""}`.toUpperCase()
        : "P";

    useEffect(() => {
        setMessages([]);
        setPagination({
            pageSize: 5,
            pageIndex: 0,
        });
        setIsFetchingMore(false);
        previousFirstMessageRef.current = null;
    }, [conversationId]);

    useEffect(() => {
        if (!data) return;

        const newMessages = [...data.messages]
            .reverse()
            .map(message => ({
                ...message,
                message: message.message,
                createdAt: message.createdAt,
                senderType: message.senderType,
            }));

        if (pagination.pageIndex === 0) {
            setMessages(newMessages);
        } else {
            setMessages(prev => [...newMessages, ...prev]);
        }

        setIsFetchingMore(false);
    }, [data, pagination.pageIndex]);

    useEffect(() => {
        const previousMessage = previousFirstMessageRef.current;

        if (!previousMessage) return;

        requestAnimationFrame(() => {
            const container = chatContainerRef.current;

            if (!container) return;

            const element = container.querySelector(
                `[data-message-id="${previousMessage.id}"]`
            );

            if (element instanceof HTMLElement) {
                element.scrollIntoView({
                    block: "start",
                    behavior: "auto",
                });
            }

            previousFirstMessageRef.current = null;
        });
    }, [messages]);

    useEffect(() => {
        const sentinel = topObserverRef.current;
        const container = chatContainerRef.current;

        if (!sentinel || !container) return;

        const observer = new IntersectionObserver(
            entries => {
                if (!entries[0].isIntersecting) return;
                if (!hasMore || isLoading || isFetching || isFetchingMore) return;

                if (messages.length > 0) {
                    previousFirstMessageRef.current = messages[0];
                }

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
    }, [
        hasMore,
        isLoading,
        isFetching,
        isFetchingMore,
        messages,
    ]);

    return (
        <main className="flex min-w-0 flex-1 flex-col">
            <header className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 font-semibold text-green-700">
                        {patientInitials}
                    </div>

                    <div className="min-w-0">
                        <h2 className="truncate font-semibold text-gray-900">
                            {patientName}
                        </h2>
                        <p className="text-xs text-gray-500">
                            Conversation history
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="rounded-lg p-2.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                >
                    <MoreVertical size={20} />
                </button>
            </header>

            <div
                ref={chatContainerRef}
                className="min-h-0 flex-1 overflow-y-auto bg-gray-50 px-6 py-6"
            >
                <div ref={topObserverRef} className="h-1" />

                {isFetchingMore && (
                    <div className="mb-4 flex justify-center">
                        <span className="rounded-full bg-white px-3 py-1 text-[10px] text-gray-400 shadow-sm">
                            Loading older messages...
                        </span>
                    </div>
                )}

                {isLoading && messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-xs text-gray-400">
                            Loading messages...
                        </p>
                    </div>
                ) : messages.length > 0 ? (
                    <div className="space-y-5">
                        {messages.map((message, index) => {
                            const isStaff = message.senderType === "Staff";

                            const messageId =
                                message.id ?? `${message.createdAt}-${index}`;

                            const senderName = isStaff
                                ? message.staff
                                    ? `${message.staff.firstname} ${message.staff.lastname}`
                                    : "Staff"
                                : message.patient
                                    ? `${message.patient.firstname} ${message.patient.lastname}`
                                    : patientName;

                            return (
                                <div
                                    key={messageId}
                                    data-message-id={messageId}
                                    className={cn(
                                        "flex items-end gap-2",
                                        isStaff
                                            ? "justify-end"
                                            : "justify-start"
                                    )}
                                >
                                    {!isStaff && (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-700">
                                            {patientInitials}
                                        </div>
                                    )}

                                    <div
                                        className={cn(
                                            "flex max-w-[70%] flex-col",
                                            isStaff
                                                ? "items-end"
                                                : "items-start"
                                        )}
                                    >
                                        <span className="mb-1 px-1 text-[11px] font-medium text-gray-500">
                                            {senderName}
                                        </span>

                                        <div
                                            className={cn(
                                                "rounded-2xl px-4 py-3 shadow-sm",
                                                isStaff
                                                    ? "rounded-br-md bg-green-600 text-white"
                                                    : "rounded-bl-md bg-white text-gray-700"
                                            )}
                                        >
                                            <p className="break-words text-sm leading-relaxed">
                                                {message.message}
                                            </p>
                                        </div>

                                        <div
                                            className={cn(
                                                "mt-1 flex items-center gap-1 px-1",
                                                isStaff
                                                    ? "justify-end"
                                                    : "justify-start"
                                            )}
                                        >
                                            <span className="text-[11px] text-gray-400">
                                                {timeAgo(message.createdAt)}
                                            </span>

                                            {isStaff && (
                                                <CheckCheck
                                                    size={14}
                                                    className="text-green-500"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-xs text-gray-400">
                            No messages in this conversation.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}