import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Doctor, DoctorSchedulePayload } from "../../types/doctor.type";

type CreateDoctorPayload = {
    firstname: string;
    lastname: string;
    doctorServices: number[];
    schedules: DoctorSchedulePayload[];
}

type CreateDoctorResponse = {
    doctor: Doctor;
    message: string;
}

const createDoctor = (data : CreateDoctorPayload) => 
    apiAxios<CreateDoctorResponse>(`/api/doctors`, {
        method: "POST",
        data
    })

export default function useCreateDoctor () {
    return useMutation({
        mutationFn: (data : CreateDoctorPayload) => createDoctor(data),
    })
}