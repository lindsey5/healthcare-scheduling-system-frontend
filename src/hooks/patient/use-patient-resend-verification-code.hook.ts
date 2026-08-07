import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { AuthResponse } from "../../types/auth.type";

const resendVerificationCode = (email: string) => 
    apiAxios<AuthResponse>("/api/patients/resend-verification-code", {
        method: "POST",
        data: { email }
    })

export default function useResendVerificationCode () {
    return useMutation({
        mutationFn: (email : string) => resendVerificationCode(email),
    })
}