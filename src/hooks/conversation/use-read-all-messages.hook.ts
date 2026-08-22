import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

const readAllMessages = () => 
    apiAxios(`/api/conversations/read`, {
        method: "POST",
    })

export default function useReadAllMessages () {
    return useMutation({
        mutationFn: () => readAllMessages(),
    })
}