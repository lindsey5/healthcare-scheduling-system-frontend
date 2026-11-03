import {
    useCallback,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { errorToast } from "../../utils/utils";
import useAcceptMessageRecordingNotice from "../../hooks/conversation/use-accept-message-recording-notice.hook";
import { RecordingConsentContext } from "./recordingConsent";

export function RecordingConsentProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [consentOverride, setConsentOverride] = useState<{
        conversationId: number;
        accepted: boolean;
    } | null>(null);
    const mutation = useAcceptMessageRecordingNotice();
    const mutateAsync = mutation.mutateAsync;

    const setRecordingConsent = useCallback(async (
        conversationId: number,
        accepted: boolean
    ) => {
        try {
            await mutateAsync({ conversationId, accepted });
            setConsentOverride({ conversationId, accepted });
        } catch {
            errorToast("Could not update recording consent", "Please try again.");
            throw new Error("Recording consent update failed.");
        }
    }, [mutateAsync]);

    const value = useMemo(
        () => ({
            consentOverride,
            isPending: mutation.isPending,
            setRecordingConsent,
        }),
        [
            consentOverride,
            setRecordingConsent,
            mutation.isPending,
        ]
    );

    return (
        <RecordingConsentContext.Provider value={value}>
            {children}
        </RecordingConsentContext.Provider>
    );
}
