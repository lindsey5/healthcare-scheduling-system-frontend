import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

type AcceptMessageRecordingNoticeResponse = {
    recordingConsentAt: string;
};

const acceptMessageRecordingNotice = (conversationId: number) =>
    apiAxios<AcceptMessageRecordingNoticeResponse>(
        `/api/conversations/${conversationId}/recording-consent`,
        {
            method: "POST",
            data: { accepted: true },
        }
    );

export default function useAcceptMessageRecordingNotice() {
    return useMutation({
        mutationFn: (conversationId: number) =>
            acceptMessageRecordingNotice(conversationId),
    });
}
