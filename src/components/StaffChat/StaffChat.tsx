import { useEffect, useState } from "react";
import {
    MessageCircle,
    X,
    Headset,
} from "lucide-react";
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
    const [activeConversationId, setActiveConversationId] =
        useState<number | null>(null);

    const socket = useSocket({
        namespace: "/conversation",
    });

    const readAllMutation = useReadAllStaffMessages();

    const { data } =
        useGetStaffConversations();

    /*
     * Load conversations.
     */
    useEffect(() => {
        if (!data) return;

        setConversations(data.conversations);
        setUnreadCount(data.conversations.reduce((prev, curr) => prev + curr.unread, 0))
    }, [data]);

    /*
     * New conversation.
     */
    useEffect(() => {
        if (!socket) return;

        const handleNewConversation = (conversation: Conversation) => {
            setConversations(prev => [...prev, conversation]);

            /*
             * Open chat when patient starts
             * a new conversation.
             */
            setIsOpen(true);
        };

         const handleEndConversation = (
            endedId?: number
        ) => {
            setConversations(prev => prev.filter(conversation => conversation.id !== endedId))
        };

        const handleNewMessage = (message: Message) => {
            setUnreadCount(prev => prev + 1);
            setConversations(prev => 
                prev.map(conversation => {
                    return conversation.id === message.conversationId ? {
                        ...conversation,
                        unread: conversation.unread + 1
                    } : conversation
                })
        )
        }

        socket.on(
            "conversation:end",
            handleEndConversation
        );

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
                "conversation:end",
                handleEndConversation
            );

            socket.off(
                "message:new",
                handleNewMessage
            );
        };
    }, [socket]);

    /*
     * Remove conversation.
     */
    const handleRemoveConversation = (
        conversationId: number
    ) => {
        setConversations(prev => prev.filter(conversation => conversation.id !== conversationId));

        setActiveConversationId((current) => {
            if (current !== conversationId) {
                return current;
            }

            return null;
        });
    };

    /*
     * Toggle chat.
     */
    const toggleChat = () => {
        setIsOpen((prev) => !prev);
    };

    const handleActiveConversation = (id: number) => {
        setActiveConversationId(id);
        handleReadAll(id);
    }

    const handleReadAll = (id: number) => {
        readAllMutation.mutate(id);
        setConversations(prev => 
            prev.map(conversation => {
                return conversation.id === id ? { ...conversation, unread: 0 } : conversation 
            })
        )

        const conversation = conversations.find(conversation => conversation.id === id);

        if(!conversation) return;

        setUnreadCount(prev => prev - conversation.unread);
    }

    return (
        <>
            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 flex h-[650px] w-[calc(100vw-48px)] max-w-[850px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                    {/* Conversation List */}
                    <div className="flex w-[280px] shrink-0 flex-col border-r border-gray-200 bg-white">
                        {/* List Header */}
                        <div className="border-b border-gray-200 p-4">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-semibold text-gray-800">
                                        Messages
                                    </h2>

                                    <p className="text-xs text-gray-400">
                                        Patient conversations
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={toggleChat}
                                    className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Conversations */}
                        <div className="min-h-0 flex-1 overflow-y-auto">
                            {conversations.length ? (
                                conversations.map(
                                    (conversation) => {
                                        const isActive =
                                            conversation.id ===
                                            activeConversationId;

                                        const patient =
                                            conversation.patient;

                                        const patientName =
                                            patient
                                                ? `${patient.firstname} ${patient.lastname}`
                                                : "Patient";

                                        const email = patient.email;

                                        return (
                                            <button
                                                key={conversation.id}
                                                type="button"
                                                onClick={() => handleActiveConversation(conversation.id)}
                                                className={cn(
                                                    "flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition",
                                                    isActive
                                                        ? "bg-green-50"
                                                        : "hover:bg-gray-50"
                                                )}
                                            >
                                                {/* Avatar */}
                                                <div
                                                    className={cn(
                                                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                                                        isActive
                                                            ? "bg-green-600 text-white"
                                                            : "bg-gray-100 text-gray-500"
                                                    )}
                                                >
                                                    <Headset
                                                        size={18}
                                                    />
                                                </div>

                                                {/* Patient */}
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p
                                                            className={cn(
                                                                "truncate text-sm font-medium",
                                                                isActive
                                                                    ? "text-green-700"
                                                                    : "text-gray-700"
                                                            )}
                                                        >
                                                            {
                                                                patientName
                                                            }
                                                        </p>

                                                        {conversation.unread > 0 && (
                                                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                                                            {conversation.unread > 99
                                                                ? "99+"
                                                                : conversation.unread}
                                                        </span>
                                                    )}
                                                    </div>

                                                    <p className="mt-0.5 truncate text-xs text-gray-400">
                                                    {email}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    }
                                )
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                        <MessageCircle
                                            size={22}
                                        />
                                    </div>

                                    <p className="text-sm font-medium text-gray-600">
                                        No conversations
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                        Patient messages will appear
                                        here.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat */}
                    <div className="min-w-0 flex-1">
                        {activeConversationId !== null &&
                        socket ? (
                            <StaffChatWidget
                                conversationId={
                                    activeConversationId
                                }
                                socket={socket}
                                handleRemove={
                                    handleRemoveConversation
                                }
                                handleReadAll={handleReadAll}
                            />
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center bg-gray-50 px-6 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                                    <MessageCircle
                                        size={28}
                                    />
                                </div>

                                <h3 className="text-sm font-semibold text-gray-700">
                                    Select a conversation
                                </h3>

                                <p className="mt-1 max-w-xs text-xs leading-relaxed text-gray-400">
                                    Choose a patient from the
                                    conversation list to start
                                    chatting.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                type="button"
                onClick={toggleChat}
                className={cn(
                    "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-105",
                    isOpen
                        ? "bg-gray-700 hover:bg-gray-800"
                        : "bg-green-600 hover:bg-green-700"
                )}
                aria-label={
                    isOpen
                        ? "Close messages"
                        : "Open messages"
                }
            >
                {/* Unread Badge */}
                {!isOpen && unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white ring-2 ring-white">
                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}
                    </span>
                )}

                {isOpen ? (
                    <X size={24} />
                ) : (
                    <MessageCircle size={24} />
                )}
            </button>
        </>
    );
}