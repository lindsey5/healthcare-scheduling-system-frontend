import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import { useAuthStore } from "../../lib/store/authStore";
import type { UpdateUserPayload, UpdateUserResponse } from "../../types/user.type";

const updateStaffProfile = (data : UpdateUserPayload) => 
    apiAxios<UpdateUserResponse>("/api/staffs/me", {
        method: "PUT",
        data
    })

export default function useUpdateStaffProfile () {
    const { setUser } = useAuthStore();

    return useMutation({
        mutationFn: (data : UpdateUserPayload) => updateStaffProfile(data),
        onSuccess: (data) => {
            setUser(data.user);
        }
    })
}