import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { AuthResponse } from "../../types/auth.type";
import type { ChangePasswordPayload } from "../../types/user.type";

const patientChangePassword = (data : ChangePasswordPayload) => 
    apiAxios<AuthResponse>("/api/patients/change-password", {
        method: "PUT",
        data
    })

export default function usePatientChangePassword () {
    return useMutation({
        mutationFn: (data : ChangePasswordPayload) => patientChangePassword(data),
    })
}