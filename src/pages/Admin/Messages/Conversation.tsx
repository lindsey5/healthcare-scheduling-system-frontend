type ConversationProps = {
    name: string;
    email: string;
    message: string;
    time: string;
    initials: string;
    active?: boolean;
    onClick: () => void;
};

export default function Conversation({
    name,
    email,
    message,
    time,
    initials,
    active,
    onClick,
}: ConversationProps) {
    return (
        <div
            className={`flex cursor-pointer gap-3 border-b border-gray-100 px-5 py-4 transition ${
                active ? "bg-green-50" : "hover:bg-gray-50"
            }`}
            onClick={onClick}
        >
            <div className="relative shrink-0">
                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold ${
                        active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                    }`}
                >
                    {initials}
                </div>

                {active && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-sm font-medium text-gray-800">
                        {name}
                    </h3>

                    <span className="shrink-0 text-[11px] text-gray-400">
                        {time}
                    </span>
                </div>

                <p className="mt-0.5 truncate text-xs text-gray-400">
                    {email}
                </p>

                <p className="mt-1 truncate text-xs text-gray-500">
                    {message}
                </p>
            </div>
        </div>
    );
}