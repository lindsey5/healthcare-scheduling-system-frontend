import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

const forgotPassword = (email: string) => 
    apiAxios<{ message: string }>("/api/patients/forgot-password", {
        method: "POST",
        data: { email }
    })

export default function useForgotPassword () {
    return useMutation({
        mutationFn: (email: string) => forgotPassword(email),
    })
}