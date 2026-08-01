import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

type DeleteServiceResponse = {
    message: string;
}

const deleteService = (id: number) => 
    apiAxios<DeleteServiceResponse>(`/api/services/${id}`, {
        method: "DELETE",
    })

export default function useDeleteService () {
    return useMutation({
        mutationFn: (id : number) => deleteService(id),
    })
}