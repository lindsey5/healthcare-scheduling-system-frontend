import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

type DeactivatePatientResponse = {
    message: string;
};

const deactivatePatient = (id: number) =>
    apiAxios<DeactivatePatientResponse>(`/api/patients/deactivate/${id}`, {
        method: "PATCH",
    });

export default function useDeactivatePatient() {
    return useMutation({
        mutationFn: (id: number) => deactivatePatient(id),
    });
}