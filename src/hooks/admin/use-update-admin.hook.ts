import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Admin } from "../../types/admin.type";

type UpdateAdminPayload = {
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
}

type UpdateAdminResponse = {
    admin: Admin;
    message: string;
}

const updateAdmin = (id: number, data : UpdateAdminPayload) => 
    apiAxios<UpdateAdminResponse>(`/api/admins/${id}`, {
        method: "PUT",
        data
    })

export default function useUpdateAdmin () {
    return useMutation({
        mutationFn: ({ data, id } : { data : UpdateAdminPayload, id: number }) => updateAdmin(id, data),
    })
}