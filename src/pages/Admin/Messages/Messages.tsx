import {
    Search,
} from "lucide-react";
import useGetConversations from "../../../hooks/conversation/use-get-conversations.hook";
import { useState } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { useDebounce } from "../../../hooks/useDebouce";
import ChatPanel from "./ChatPanel";
import Conversation from "./Conversation";

export default function Messages() {
    const [activeConversation, setActiveConversation] = useState<number>();

    const [pagination, setPagination] = useState<PaginationState>({
        pageSize: 5,
        pageIndex: 0,
    });
    const [search, setSearch] = useState("");
    const searchDebounced = useDebounce(search);

    const { data } = useGetConversations({
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        search: searchDebounced
    });

    return (
        <div className="flex h-[calc(100vh-2rem)] min-h-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Conversations Sidebar */}
            <aside className="flex w-full max-w-sm flex-col border-r border-gray-200">
                {/* Header */}
                <div className="border-b border-gray-200 p-5">
                    <div className="mb-4">
                        <h1 className="text-xl font-semibold text-gray-900">
                            Messages
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Monitor staff and patient conversations
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            onChange={(e) => {
                                setPagination(prev => ({ ...prev, pageIndex: 0 }));
                                setSearch(e.target.value);
                            }}
                            placeholder="Search conversations..."
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                        />
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto">
                    {data?.conversations.map(conversation => {
                        const patient = conversation.patient;

                        const patientName = patient
                            ? `${patient.firstname} ${patient.lastname}`
                            : "Patient";

                        const initials = patient
                            ? `${patient.firstname?.[0] ?? ""}${patient.lastname?.[0] ?? ""}`.toUpperCase()
                            : "P";

                        const lastMessageTime = new Date(
                            conversation.lastMessageAt
                        ).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                        })

                        return (
                            <Conversation
                                key={conversation.id}
                                initials={initials}
                                name={patientName}
                                email={conversation.patient.email}
                                message={conversation.lastMessage ?? "No messages yet"}
                                time={lastMessageTime}
                                onClick={() => setActiveConversation(conversation.id)}
                            />
                        );
                    })}
                </div>
            </aside>

            {/* Chat Panel */}
            {activeConversation && (
                <ChatPanel conversationId={activeConversation} />
            )}
        </div>
    );
}