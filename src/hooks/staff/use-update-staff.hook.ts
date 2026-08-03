import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Staff } from "../../types/staff.type";

type UpdateStaffPayload = {
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
};

type UpdateStaffResponse = {
    staff: Staff;
    message: string;
};

const updateStaff = (id: number, data: UpdateStaffPayload) =>
    apiAxios<UpdateStaffResponse>(`/api/staffs/${id}`, {
        method: "PUT",
        data,
    });

export default function useUpdateStaff() {
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: UpdateStaffPayload;
        }) => updateStaff(id, data),
    });
}