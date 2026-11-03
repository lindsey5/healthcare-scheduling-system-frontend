import { createContext } from "react";

export type RecordingConsentContextValue = {
    consentOverride: {
        conversationId: number;
        accepted: boolean;
    } | null;
    isPending: boolean;
    setRecordingConsent: (
        conversationId: number,
        accepted: boolean
    ) => Promise<void>;
};

export const RecordingConsentContext =
    createContext<RecordingConsentContextValue | null>(null);
