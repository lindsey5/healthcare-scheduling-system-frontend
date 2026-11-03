import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

type AcceptMessageRecordingNoticeResponse = {
    recordingConsentAt: string | null;
};

const updateMessageRecordingConsent = (
    conversationId: number,
    accepted: boolean
) =>
    apiAxios<AcceptMessageRecordingNoticeResponse>(
        `/api/conversations/${conversationId}/recording-consent`,
        {
            method: "POST",
            data: { accepted },
        }
    );

export default function useAcceptMessageRecordingNotice() {
    return useMutation({
        mutationFn: ({
            conversationId,
            accepted,
        }: {
            conversationId: number;
            accepted: boolean;
        }) => updateMessageRecordingConsent(conversationId, accepted),
    });
}
