import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

interface ResetPasswordPayload {
    token: string;
    password: string;
}

const resetPassword = (data : ResetPasswordPayload) => 
    apiAxios<{ message: string }>("/api/patients/reset-password", {
        method: "PATCH",
        data
    })

export default function useResetPassword () {
    return useMutation({
        mutationFn: (data: ResetPasswordPayload) => resetPassword(data),
    })
}