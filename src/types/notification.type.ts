import type { Appointment } from "./appointment.type";

export interface PatientNotification {
    id: number;
    appointmentId: string;
    appointment: Appointment;
    patientId: number;
    message: string;
    isRead: boolean;
    createdAt: Date;
}