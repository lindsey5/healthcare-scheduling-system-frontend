import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

type ActivatePatientResponse = {
    message: string;
}

const activatePatient = (id: number) => 
    apiAxios<ActivatePatientResponse>(`/api/patients/activate/${id}`, {
        method: "PATCH",
    })

export default function useActivatePatient () {
    return useMutation({
        mutationFn: (id: number) => activatePatient(id),
    })
}