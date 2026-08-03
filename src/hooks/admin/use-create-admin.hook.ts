import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Admin } from "../../types/admin.type";

type CreateAdminPayload = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

type CreateAdminResponse = {
    admin: Admin;
    message: string;
}

const createAdmin = (data : CreateAdminPayload) => 
    apiAxios<CreateAdminResponse>(`/api/admins`, {
        method: "POST",
        data
    })

export default function useCreateAdmin () {
    return useMutation({
        mutationFn: (data : CreateAdminPayload) => createAdmin(data),
    })
}