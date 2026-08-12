import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import { useAuthStore } from "../../lib/store/authStore";
import type { UpdateUserPayload, UpdateUserResponse } from "../../types/user.type";

const updatePatientOwn = (data : UpdateUserPayload) => 
    apiAxios<UpdateUserResponse>("/api/patients/me", {
        method: "PUT",
        data
    })

export default function useUpdatePatientOwn () {
    const { setUser } = useAuthStore();

    return useMutation({
        mutationFn: (data : UpdateUserPayload) => updatePatientOwn(data),
        onSuccess: (data) => {
            setUser(data.user);
        }
    })
}