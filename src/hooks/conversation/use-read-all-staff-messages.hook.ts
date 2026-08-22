import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

const readAllMessages = (id: number) => 
    apiAxios(`/api/conversations/read/${id}`, {
        method: "POST",
    })

export default function useReadAllStaffMessages () {
    return useMutation({
        mutationFn: (id: number) => readAllMessages(id),
    })
}