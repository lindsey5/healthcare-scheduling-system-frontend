import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

type DeleteAdminResponse = {
    message: string;
}

const deleteAdmin = (id: number) => 
    apiAxios<DeleteAdminResponse>(`/api/admins/${id}`, {
        method: "DELETE",
    })

export default function useDeleteAdmin () {
    return useMutation({
        mutationFn: (id : number) => deleteAdmin(id),
    })
}