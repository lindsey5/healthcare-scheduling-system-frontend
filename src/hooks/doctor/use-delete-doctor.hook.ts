import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

type DeleteDoctorResponse = {
    message: string;
}

const deleteDoctor = (id: number) => 
    apiAxios<DeleteDoctorResponse>(`/api/doctors/${id}`, {
        method: "DELETE",
    })

export default function useDeleteDoctor () {
    return useMutation({
        mutationFn: (id : number) => deleteDoctor(id),
    })
}