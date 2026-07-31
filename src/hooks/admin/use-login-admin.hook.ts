import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import { useAuthStore } from "../../lib/store/authStore";
import type { AuthResponse, LoginPayload } from "../../types/auth.type";

const loginAdmin = (data : LoginPayload) => 
    apiAxios<AuthResponse>("/api/admins/login", {
        method: "POST",
        data
    })

export default function useLoginAdmin () {
    const { setAuth, setUser } = useAuthStore();

    return useMutation({
        mutationFn: (data : LoginPayload) => loginAdmin(data),
        onSuccess: (data) => {
            const { accessToken, refreshToken } = data.token;

            setUser(data.user);
            setAuth(accessToken, refreshToken);
        }
    })
}