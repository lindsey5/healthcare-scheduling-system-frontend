import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { User } from "../../types/user.type";
import { useAuthStore } from "../../lib/store/authStore";

type LoginPayload = {
    email: string;
    password: string;
}

type LoginResponse = {
    user: User,
    token: {
        refreshToken: string;
        accessToken: string;
    },
    message?: string;
}

const loginPatient = (data : LoginPayload) => 
    apiAxios<LoginResponse>("/api/patients/login", {
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