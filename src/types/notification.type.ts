import type { Appointment } from "./appointment.type";

interface Notification {
    id: number;
    appointmentId: string;
    appointment: Appointment;
    message: string;
    isRead: boolean;
    createdAt: Date;
}

export interface PatientNotification extends Notification{
    patientId: number;
}

export interface AdminNotification extends Notification {
    adminId: number;
}