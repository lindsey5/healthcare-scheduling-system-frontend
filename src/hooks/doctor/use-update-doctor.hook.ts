import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Doctor } from "../../types/doctor.type";

type UpdateDoctorPayload = {
    firstname: string;
    lastname: string;
    doctorServices: number[];
}

type UpdateDoctorResponse = {
    doctor: Doctor;
    message: string;
}

const updateDoctor = (id: number, data : UpdateDoctorPayload) => 
    apiAxios<UpdateDoctorResponse>(`/api/doctors/${id}`, {
        method: "PUT",
        data
    })

export default function useUpdateDoctor () {
    return useMutation({
        mutationFn: ({ data, id } : { data : UpdateDoctorPayload, id: number }) => updateDoctor(id, data),
    })
}