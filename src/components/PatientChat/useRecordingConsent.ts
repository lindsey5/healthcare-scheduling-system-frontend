import { useContext } from "react";
import { RecordingConsentContext } from "./recordingConsent";

export default function useRecordingConsent() {
    const context = useContext(RecordingConsentContext);

    if (!context) {
        throw new Error(
            "useRecordingConsent must be used within RecordingConsentProvider."
        );
    }

    return context;
}
