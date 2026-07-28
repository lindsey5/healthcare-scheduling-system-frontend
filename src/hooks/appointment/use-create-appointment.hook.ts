import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Appointment } from "../../types/appointment.type";

type CreateAppointment = {
    serviceId: number;
    doctorId: number;

    appointmentDate: string;
    appointmentTime: string;
    purposeOfVisit: string;
}

type CreateAppointmentRecord = {
    firstName: string;
    middleName?: string;
    lastName: string;
    suffix?: string;

    birthDate: string;
    gender: string;
    civilStatus: string;

    contactNumber: string;
    email?: string;
    completeAddress: string;

    emergencyContactPerson?: string;
    emergencyContactNumber?: string;
}

type Payload = {
    appointment: CreateAppointment;
    appointmentRecord: CreateAppointmentRecord;
}

type CreateAppointmentResponse = {
    appointment: Appointment;
    message: string;
}

const createAppointment = (data : Payload) => 
    apiAxios<CreateAppointmentResponse>("/api/appointments", {
        method: "POST",
        data
    })

export default function useCreateAppointment () {
    return useMutation({
        mutationFn: (data : Payload) => createAppointment(data),
    })
}