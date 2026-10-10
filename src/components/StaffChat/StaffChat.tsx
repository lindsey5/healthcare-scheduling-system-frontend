
import { useCallback, useEffect, useState } from "react";
import { MessageCircle, X, Search } from "lucide-react";
import { cn } from "../../utils/utils";
import { useSocket } from "../../hooks/useSocket";
import useGetStaffConversations from "../../hooks/conversation/use-get-staff-conversations.hook";
import StaffChatWidget from "./StaffChatWidget";
import type { Conversation, Message } from "../../types/conversation.type";
import useReadAllStaffMessages from "../../hooks/conversation/use-read-all-staff-messages.hook";

export default function StaffChat() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<number | null>(null);

    const socket = useSocket({ namespace: "/conversation" });
    const readAllMutation = useReadAllStaffMessages();
    const { data, refetch } = useGetStaffConversations();

    // Keep the total unread count numeric and consistent.
    const calculateUnreadCount = useCallback(
        (items: Conversation[]) =>
            items.reduce(
                (total, conversation) =>
                    total + Number(conversation.unread || 0),
                0
            ),
        []
    );

    // Initialize conversations from the API response.
    useEffect(() => {
        if (!data) return;

        const items = data.conversations;

        setConversations(items);
        setUnreadCount(calculateUnreadCount(items));
    }, [data, calculateUnreadCount]);

    // Fetch the latest conversation data and synchronize the badge.
    const handleRefetch = useCallback(async () => {
        const result = await refetch();
        const updatedConversations = result.data?.conversations;

        if (!updatedConversations) return;

        setConversations(updatedConversations);
        setUnreadCount(calculateUnreadCount(updatedConversations));
    }, [refetch, calculateUnreadCount]);

    const handleRemoveConversation = useCallback((conversationId: number) => {
        setConversations(prev => {
            const updated = prev.filter(
                conversation => conversation.id !== conversationId
            );

            setUnreadCount(calculateUnreadCount(updated));

            return updated;
        });

        setActiveConversationId(current =>
            current === conversationId ? null : current
        );
    }, [calculateUnreadCount]);

    useEffect(() => {
        if (!socket) return;

        const handleNewConversation = () => {
            void handleRefetch();
            setIsOpen(true);
        };

        const handleEndConversation = (conversationId: number) => {
            handleRemoveConversation(conversationId);
            void handleRefetch();
        };

        const handleNewMessage = (message: Message) => {
            // Do not increment unreadCount separately.
            // The API response is the source of truth for the badge.
            void handleRefetch();
        };

        socket.on("conversation:new", handleNewConversation);
        socket.on("conversation:end", handleEndConversation);
        socket.on("message:new", handleNewMessage);

        return () => {
            socket.off("conversation:new", handleNewConversation);
            socket.off("conversation:end", handleEndConversation);
            socket.off("message:new", handleNewMessage);
        };
    }, [socket, handleRefetch, handleRemoveConversation]);

    const toggleChat = () => setIsOpen(prev => !prev);

    const handleReadAll = useCallback((id: number) => {
        const conversation = conversations.find(
            item => item.id === id
        );

        if (!conversation) return;

        // Optimistically mark the conversation as read.
        setConversations(prev => {
            const updated = prev.map(item =>
                item.id === id
                    ? { ...item, unread: 0 }
                    : item
            );

            setUnreadCount(calculateUnreadCount(updated));

            return updated;
        });

        readAllMutation.mutate(id, {
            onError: () => {
                // Restore the latest server state if marking as read fails.
                void handleRefetch();
            },
        });
    }, [
        conversations,
        readAllMutation,
        calculateUnreadCount,
        handleRefetch,
    ]);

    const handleActiveConversation = (id: number) => {
        setActiveConversationId(id);
        handleReadAll(id);
    };

    const activeConversation = conversations.find(
        conversation => conversation.id === activeConversationId
    );

    const activePatient = activeConversation?.patient;

    const activePatientName = activePatient
        ? `${activePatient.firstname} ${activePatient.lastname}`
        : "Patient";

    return (
        <>
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-20 flex h-[650px] w-[calc(100vw-48px)] max-w-[950px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                    {/* Conversation Sidebar */}
                    <aside className="flex w-[320px] shrink-0 flex-col border-r border-gray-200 bg-white">
                        <div className="border-b border-gray-200 p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Messages
                                    </h2>
                                    <p className="mt-0.5 text-xs text-gray-500">
                                        Patient conversations
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={toggleChat}
                                    className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                                >
                                    <X size={19} />
                                </button>
                            </div>

                            <div className="relative">
                                <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                                />
                            </div>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto">
                            {conversations.length > 0 ? (
                                conversations.map(conversation => {
                                    const isActive =
                                        conversation.id === activeConversationId;

                                    const patient = conversation.patient;

                                    const patientName = patient
                                        ? `${patient.firstname} ${patient.lastname}`
                                        : "Patient";

                                    const initials = patient
                                        ? `${patient.firstname?.[0] ?? ""}${patient.lastname?.[0] ?? ""}`
                                        : "P";

                                    const unread = Number(
                                        conversation.unread || 0
                                    );

                                    return (
                                        <button
                                            key={conversation.id}
                                            type="button"
                                            onClick={() =>
                                                handleActiveConversation(
                                                    conversation.id
                                                )
                                            }
                                            className={cn(
                                                "flex w-full gap-3 border-b border-gray-100 px-4 py-4 text-left transition",
                                                isActive
                                                    ? "bg-green-50"
                                                    : "hover:bg-gray-50"
                                            )}
                                        >
                                            <div className="relative shrink-0">
                                                <div
                                                    className={cn(
                                                        "flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold",
                                                        isActive
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-600"
                                                    )}
                                                >
                                                    {initials.toUpperCase()}
                                                </div>

                                                {isActive && (
                                                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p
                                                        className={cn(
                                                            "truncate text-sm",
                                                            unread > 0
                                                                ? "font-semibold text-gray-900"
                                                                : "font-medium text-gray-800"
                                                        )}
                                                    >
                                                        {patientName}
                                                    </p>

                                                    <div className="flex shrink-0 items-center gap-2">
                                                        {conversation.lastMessageAt && (
                                                            <span
                                                                className={cn(
                                                                    "text-[10px]",
                                                                    unread > 0
                                                                        ? "font-medium text-green-600"
                                                                        : "text-gray-400"
                                                                )}
                                                            >
                                                                {new Date(
                                                                    conversation.lastMessageAt
                                                                ).toLocaleTimeString(
                                                                    [],
                                                                    {
                                                                        hour: "numeric",
                                                                        minute: "2-digit",
                                                                    }
                                                                )}
                                                            </span>
                                                        )}

                                                        {unread > 0 && (
                                                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1.5 text-[10px] font-bold text-white">
                                                                {unread > 99
                                                                    ? "99+"
                                                                    : unread}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <p
                                                    className={cn(
                                                        "mt-1 truncate text-xs",
                                                        unread > 0
                                                            ? "font-medium text-gray-600"
                                                            : "text-gray-400"
                                                    )}
                                                >
                                                    {conversation.lastMessage ||
                                                        "No messages yet"}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                        <MessageCircle size={25} />
                                    </div>

                                    <p className="text-sm font-medium text-gray-700">
                                        No conversations
                                    </p>

                                    <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-gray-400">
                                        Patient messages will appear here when a
                                        conversation starts.
                                    </p>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Chat */}
                    <section className="flex min-w-0 flex-1 flex-col">
                        {activeConversationId !== null && socket ? (
                            <>
                                <div className="flex h-[73px] shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="relative shrink-0">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
                                                {activePatient
                                                    ? `${activePatient.firstname?.[0] ?? ""}${activePatient.lastname?.[0] ?? ""}`.toUpperCase()
                                                    : "P"}
                                            </div>

                                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="truncate text-sm font-semibold text-gray-900">
                                                {activePatientName}
                                            </h3>
                                            <p className="text-xs text-green-600">
                                                Active conversation
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="min-h-0 flex-1">
                                    <StaffChatWidget
                                        conversationId={activeConversationId}
                                        socket={socket}
                                        handleRemove={handleRemoveConversation}
                                        handleReadAll={handleReadAll}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center bg-gray-50 px-6 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                                    <MessageCircle size={28} />
                                </div>

                                <h3 className="text-sm font-semibold text-gray-800">
                                    Select a conversation
                                </h3>

                                <p className="mt-1 max-w-xs text-xs leading-relaxed text-gray-400">
                                    Choose a patient from the conversation list
                                    to view your messages.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            )}

            {/* Floating Button */}
            <button
                type="button"
                onClick={toggleChat}
                className={cn(
                    "fixed bottom-6 right-6 z-20 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-105",
                    isOpen
                        ? "bg-gray-700 hover:bg-gray-800"
                        : "bg-green-600 hover:bg-green-700"
                )}
                aria-label={
                    isOpen ? "Close messages" : "Open messages"
                }
            >
                {!isOpen && unreadCount > 0 && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-50" />
                )}

                {!isOpen && unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 z-20 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white ring-2 ring-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}

                <span className="relative z-10">
                    {isOpen ? (
                        <X size={24} />
                    ) : (
                        <MessageCircle size={24} />
                    )}
                </span>
            </button>
        </>
    );
}
