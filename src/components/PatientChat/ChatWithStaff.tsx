import { memo, useCallback, useEffect, useRef, useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import { Headset, Loader2, Send, User } from "lucide-react";
import type { PaginationState } from "@tanstack/react-table";
import type { Socket } from "socket.io-client";
import type { ConversationMessage } from "../../types/conversation.type";
import { cn, errorToast, timeAgo } from "../../utils/utils";
import Button from "../ui/Button";
import useGetPatientConversation from "../../hooks/conversation/use-get-patient-conversation.hook";
import { RecordingConsentProvider } from "./RecordingConsentContext";
import useRecordingConsent from "./useRecordingConsent";

type RecordingConsentNoticeProps = {
    conversationId?: number;
    recordingConsentAt: string | null | undefined;
};

const RecordingConsentNotice = memo(function RecordingConsentNotice({
    conversationId,
    recordingConsentAt,
}: RecordingConsentNoticeProps) {
    const {
        consentOverride,
        isPending,
        setRecordingConsent,
    } = useRecordingConsent();
    const checked = consentOverride &&
        consentOverride.conversationId === conversationId
        ? consentOverride.accepted
        : Boolean(recordingConsentAt);
    const onChange = useCallback(async (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        if (!conversationId) return;

        try {
            await setRecordingConsent(conversationId, event.target.checked);
        } catch {
            return;
        }
    }, [conversationId, setRecordingConsent]);

    return (
        <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <label className="group relative mt-2 flex cursor-pointer items-start gap-2 text-xs font-medium text-gray-700">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    disabled={!conversationId || isPending}
                    className="mt-0.5 h-4 w-4 accent-green-600"
                />
                <span>
                    I understand and acknowledge that these messages are
                    recorded and stored.
                </span>
                <span
                    role="tooltip"
                    className="pointer-events-none absolute bottom-full left-0 z-10 mb-2 hidden w-72 rounded-md bg-gray-900 px-3 py-2 text-xs font-normal leading-5 text-white shadow-lg group-hover:block group-focus-within:block"
                >
                    Messages in this staff conversation are recorded and
                    stored in your conversation history. Authorized health
                    center staff may access them to respond to your inquiry.
                    Please avoid sharing information that is not needed.
                </span>
            </label>
        </div>
    );
});

interface ChatWithStaffProps {
    socket: Socket | null;
    setUnread: Dispatch<SetStateAction<number>>;
    messages: ConversationMessage[];
    setMessages: Dispatch<SetStateAction<ConversationMessage[]>>;
    handleReadAll: () => void;
}

function ChatWithStaffContent({
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

    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const previousScrollHeightRef = useRef(0);
    const previousScrollTopRef = useRef(0);
    const shouldScrollToBottomRef = useRef(true);

    const { data, isLoading, isFetching } = useGetPatientConversation({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    });
    const {
        consentOverride,
        isPending: isRecordingConsentPending,
    } = useRecordingConsent();
    const isFetchingMore = pagination.pageIndex > 0 && isFetching;
    const hasAcknowledgedRecording = Boolean(
        consentOverride &&
        data &&
        consentOverride.conversationId === data.conversation.id
            ? consentOverride.accepted
            : data?.conversation.recordingConsentAt
    );
    const chatStatus =
        status === "waiting" &&
        data?.conversation.status === "Active" &&
        data.conversation.assignedStaffId !== null
            ? "active"
            : status;

    const hasMore = data
        ? pagination.pageIndex + 1 < data.totalPages
        : false;

    const loadOlderMessages = useCallback(() => {
        if (isLoading || isFetching || !hasMore) return;

        const container = chatContainerRef.current;
        if (!container) return;

        previousScrollHeightRef.current = container.scrollHeight;
        setPagination(prev => ({
            ...prev,
            pageIndex: prev.pageIndex + 1,
        }));
    }, [hasMore, isFetching, isLoading]);

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
        if (!data) return;

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

    }, [data, pagination.pageIndex, setMessages]);

    useEffect(() => {
        if (!socket) return;

        const handleMessageError = (message: string) => {
            errorToast("Message not sent", message);
        };

        socket.on("message:error", handleMessageError);
        return () => {
            socket.off("message:error", handleMessageError);
        };
    }, [socket]);

    useEffect(() => {
        if (pagination.pageIndex === 0 || isFetching) return;

        const container = chatContainerRef.current;
        if (!container) return;

        const previousHeight = previousScrollHeightRef.current;
        if (!previousHeight) return;

        const newHeight = container.scrollHeight;
        container.scrollTop = newHeight - previousHeight;
        previousScrollHeightRef.current = 0;
    }, [messages, pagination.pageIndex, isFetching]);

    useEffect(() => {
        if (!socket) return;

        const handleConversationStatus = (hasAvailable: boolean) => {
            if (hasAvailable) {
                setStatus("active");
            } else {
                errorToast("Failed", "No Available Staff, Please try again later");
            }
        };

        const handleEndConversation = () => {
            setStatus("ended");
        };

        socket.on("conversation:status", handleConversationStatus);
        socket.on("conversation:end", handleEndConversation);

        return () => {
            socket.off("conversation:status", handleConversationStatus);
            socket.off("conversation:end", handleEndConversation);
        };
    }, [socket, setMessages, setUnread]);

    const handleStart = () => {
        if (!hasAcknowledgedRecording) return;
        socket?.emit("conversation:start");
    };

    const conversationId = data?.conversation.id;
    const endConversation = () => {
        if (!socket || !data?.conversation) return;

        socket.emit("conversation:end", data.conversation.id);
        setStatus("ended");
    };

    const sendMessage = () => {
        if (
            !input.trim() ||
            !data?.conversation ||
            !hasAcknowledgedRecording
        ) return;

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

    const handleChatScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = event.currentTarget.scrollTop;
        const reachedTopWhileScrollingUp =
            scrollTop <= 24 && scrollTop < previousScrollTopRef.current;
        previousScrollTopRef.current = scrollTop;

        if (reachedTopWhileScrollingUp) {
            loadOlderMessages();
        }
    };

    const handleChatWheel = (event: React.WheelEvent<HTMLDivElement>) => {
        if (event.deltaY < 0 && event.currentTarget.scrollTop <= 24) {
            loadOlderMessages();
        }
    };

    return (
        <>
            <div
                ref={chatContainerRef}
                onScroll={handleChatScroll}
                onWheel={handleChatWheel}
                className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-4"
            >
                {isLoading && messages.length === 0 && (
                    <div className="flex h-full items-center justify-center gap-2 text-sm text-gray-500">
                        <Loader2
                            size={18}
                            className="animate-spin text-green-600"
                            aria-hidden="true"
                        />
                        <span>Loading conversation...</span>
                    </div>
                )}
                {isFetchingMore && (
                    <div className="flex items-center justify-center gap-2 py-2 text-xs text-gray-400">
                        <Loader2
                            size={14}
                            className="animate-spin"
                            aria-hidden="true"
                        />
                        <span>Loading older messages...</span>
                    </div>
                )}

                {data && !isFetching && !hasMore && messages.length > 0 && (
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
                <RecordingConsentNotice
                    conversationId={conversationId}
                    recordingConsentAt={data?.conversation.recordingConsentAt}
                />

                {chatStatus !== "active" ? (
                    <>
                        <Button
                            disabled={
                                isLoading ||
                                !hasAcknowledgedRecording ||
                                isRecordingConsentPending
                            }
                            className="w-full"
                            onClick={handleStart}
                        >
                            Start Conversation
                        </Button>

                        {chatStatus === "ended" && (
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
                                disabled={!hasAcknowledgedRecording}
                                className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                            />

                            <button
                                type="button"
                                onClick={sendMessage}
                                disabled={
                                    !input.trim() ||
                                    !hasAcknowledgedRecording
                                }
                                className={cn(
                                    "flex h-9 w-9 items-center justify-center rounded-lg text-white transition",
                                    input.trim() && hasAcknowledgedRecording
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

export default function ChatWithStaff(props: ChatWithStaffProps) {
    return (
        <RecordingConsentProvider>
            <ChatWithStaffContent {...props} />
        </RecordingConsentProvider>
    );
}