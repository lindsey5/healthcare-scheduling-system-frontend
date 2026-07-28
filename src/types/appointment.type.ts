import type { Doctor } from "./doctor.type";
import type { Patient } from "./patient.type";
import type { Service } from "./service.type";

export interface AppointmentAttributes {
    id: string;

    patientId: number;
    patient: Patient;

    serviceId: number;
    serviced: Service;

    doctorId: number;
    doctor: Doctor;

    appointmentDate: Date;
    appointmentTime: string;

    status:
        | "Pending"
        | "Approved"
        | "Checked In"
        | "Completed"
        | "Cancelled"
        | "No Show"
        | "Rescheduled";

    purposeOfVisit: string | null;

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