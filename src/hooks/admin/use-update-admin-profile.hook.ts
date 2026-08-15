import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import { useAuthStore } from "../../lib/store/authStore";
import type { UpdateUserPayload, UpdateUserResponse } from "../../types/user.type";

const updateAdminProfile = (data : UpdateUserPayload) => 
    apiAxios<UpdateUserResponse>("/api/admins/me", {
        method: "PUT",
        data
    })

export default function useUpdateAdminProfile () {
    const { setUser } = useAuthStore();

    return useMutation({
        mutationFn: (data : UpdateUserPayload) => updateAdminProfile(data),
        onSuccess: (data) => {
            setUser(data.user);
        }
    })
}