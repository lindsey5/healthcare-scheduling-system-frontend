import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

type  RegisterPatient = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

type RegisterPatientResponse = {
    message: string;
}

const registerPatient = (data : RegisterPatient) => 
    apiAxios<RegisterPatientResponse>("/api/patients/register", {
        method: "POST",
        data
    })

export default function useRegisterPatient () {
    return useMutation({
        mutationFn: (data : RegisterPatient) => registerPatient(data),
    })
}