import type { Doctor } from "./doctor.type";
import type { PaginationParams, PaginationResponse } from "./pagination.type";
import type { Patient } from "./patient.type";
import type { Service } from "./service.type";

export interface Appointment {
    id: string;

    referenceNumber: string;

    patientId: number;
    patient: Patient;

    serviceId: number;
    service: Service;

    doctorId: number;
    doctor: Doctor;

    appointmentDate: string;
    appointmentTime: string;

    status:
        | "Pending"
        | "Approved"
        | "Checked In"
        | "Completed"
        | "Cancelled"
        | "No Show"
        | "Rescheduled";

    purposeOfVisit: string;

    createdAt: Date;

    appointmentRecord: AppointmentRecord;
}

export interface AppointmentRecord {
    id: number;
    appointmentId: string;

    firstName: string;
    middleName?: string;
    lastName: string;
    suffix?: string;

    birthDate: Date;
    gender: "Male" | "Female";
    civilStatus: "Single" | "Married" | "Widowed" | "Separated";

    contactNumber: string;
    email?: string;
    completeAddress: string;

    emergencyContactPerson?: string;
    emergencyContactNumber?: string;
}

export interface GetAppointmentsParams extends PaginationParams {
    search?: string;
    status?: string;
}

export interface GetAppointmentsResponse extends PaginationResponse {
    appointments: Appointment[];
}