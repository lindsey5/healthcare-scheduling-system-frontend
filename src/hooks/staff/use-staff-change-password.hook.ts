import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { AuthResponse } from "../../types/auth.type";
import type { ChangePasswordPayload } from "../../types/user.type";

const staffChangePassword = (data : ChangePasswordPayload) => 
    apiAxios<AuthResponse>("/api/staffs/change-password", {
        method: "PUT",
        data
    })

export default function useStaffChangePassword () {
    return useMutation({
        mutationFn: (data : ChangePasswordPayload) => staffChangePassword(data),
    })
}