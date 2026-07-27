import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

type  RegisterUser = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

type RegisterUserResponse = {
    message: string;
}

const registerUser = (data : RegisterUser) => 
    apiAxios<RegisterUserResponse>("/api/users/register", {
        method: "POST",
        data
    })

export default function useRegisterUser () {
    return useMutation({
        mutationFn: (data : RegisterUser) => registerUser(data),
    })
}