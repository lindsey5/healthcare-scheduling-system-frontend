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

const loginUser = (data : LoginPayload) => 
    apiAxios<LoginResponse>("/api/users/login", {
        method: "POST",
        data
    })

export default function useLoginUser () {
    const { setAuth, setUser } = useAuthStore();

    return useMutation({
        mutationFn: (data : LoginPayload) => loginUser(data),
        onSuccess: (data) => {
            const { accessToken, refreshToken } = data.token;

            setUser(data.user);
            setAuth(accessToken, refreshToken);
        }
    })
}