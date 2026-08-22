import type { Patient } from "./patient.type";
import type { Staff } from "./staff.type";

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
    unread: number;
}

export interface Message {
    id: number;
    conversationId: number;
    conversation: Conversation;
    senderId: number;
    senderType: "Patient" | "Staff";
    patientSender: Patient | null;
    staffSender: Staff | null;
    message: string;
    createdAt: string;
}