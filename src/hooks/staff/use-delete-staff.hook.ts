import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

type DeleteStaffResponse = {
    message: string;
};

const deleteStaff = (id: number) =>
    apiAxios<DeleteStaffResponse>(`/api/staffs/${id}`, {
        method: "DELETE",
    });

export default function useDeleteStaff() {
    return useMutation({
        mutationFn: (id: number) => deleteStaff(id),
    });
}