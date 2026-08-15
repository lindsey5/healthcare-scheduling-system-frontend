import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { AuthResponse } from "../../types/auth.type";
import type { ChangePasswordPayload } from "../../types/user.type";

const adminChangePassword = (data : ChangePasswordPayload) => 
    apiAxios<AuthResponse>("/api/admins/change-password", {
        method: "PUT",
        data
    })

export default function useAdminChangePassword () {
    return useMutation({
        mutationFn: (data : ChangePasswordPayload) => adminChangePassword(data),
    })
}