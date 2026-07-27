import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

type VerifyUserPayload = {
    email: string;
    verificationCode: string;
}

type VerifyUserResponse = {
    message: string;
}

const verifyUser = (data : VerifyUserPayload) => 
    apiAxios<VerifyUserResponse>("/api/users/verify", {
        method: "POST",
        data
    })

export default function useVerifyUser () {
    return useMutation({
        mutationFn: (data : VerifyUserPayload) => verifyUser(data),
    })
}