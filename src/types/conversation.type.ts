import type { Patient } from "./patient.type";

export type ConversationMessage = {
    message: string;
    createdAt: string;
    senderType: "Patient" | "Staff";
};

export interface Conversation {
    id: number;
    patientId: number;
    assignedStaffId: number | null;
    status: "Waiting" | "Active" | "Closed";
    createdAt: string;
    patient: Patient;
}

export interface Message {
    id: number;
    conversationId: number;
    conversation: Conversation;
    senderId: number;
    senderType: "Patient" | "Staff";
    message: string;
    createdAt: string;
}