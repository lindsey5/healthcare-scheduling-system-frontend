import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import { useAuthStore } from "../../lib/store/authStore";
import type { AuthResponse, LoginPayload } from "../../types/auth.type";

const loginStaff = (data : LoginPayload) => 
    apiAxios<AuthResponse>("/api/staffs/login", {
        method: "POST",
        data
    })

export default function useLoginStaff () {
    const { setAuth, setUser } = useAuthStore();

    return useMutation({
        mutationFn: (data : LoginPayload) => loginStaff(data),
        onSuccess: (data) => {
            const { accessToken, refreshToken } = data.token;

            setUser(data.user);
            setAuth(accessToken, refreshToken);
        }
    })
}