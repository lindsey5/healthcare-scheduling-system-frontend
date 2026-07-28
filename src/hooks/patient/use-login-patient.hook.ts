import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import { useAuthStore } from "../../lib/store/authStore";
import type { AuthResponse, LoginPayload } from "../../types/auth.type";

const loginPatient = (data : LoginPayload) => 
    apiAxios<AuthResponse>("/api/patients/login", {
        method: "POST",
        data
    })

export default function useLoginPatient () {
    const { setAuth, setUser } = useAuthStore();

    return useMutation({
        mutationFn: (data : LoginPayload) => loginPatient(data),
        onSuccess: (data) => {
            const { accessToken, refreshToken } = data.token;

            setUser(data.user);
            setAuth(accessToken, refreshToken);
        }
    })
}