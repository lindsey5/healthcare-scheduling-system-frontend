import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { User } from "../../types/user.type";
import { useAuthStore } from "../../lib/store/authStore";

type VerifyPatientPayload = {
    email: string;
    verificationCode: string;
}

type VerifyPatientResponse = {
    user: User,
    token: {
        refreshToken: string;
        accessToken: string;
    },
    message?: string;
}

const verifyPatient = (data : VerifyPatientPayload) => 
    apiAxios<VerifyPatientResponse>("/api/patients/verify", {
        method: "POST",
        data
    })

export default function useVerifyPatient () {
    const { setAuth, setUser } = useAuthStore();

    return useMutation({
        mutationFn: (data : VerifyPatientPayload) => verifyPatient(data),
        onSuccess: (data) => {
            const { accessToken, refreshToken } = data.token;

            setUser(data.user);
            setAuth(accessToken, refreshToken);
        }
    })
}