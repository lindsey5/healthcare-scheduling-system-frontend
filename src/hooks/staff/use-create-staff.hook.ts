import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Staff } from "../../types/staff.type";

type CreateStaffPayload = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
};

type CreateStaffResponse = {
    staff: Staff;
    message: string;
};

const createStaff = (data: CreateStaffPayload) =>
    apiAxios<CreateStaffResponse>("/api/staffs", {
        method: "POST",
        data,
    });

export default function useCreateStaff() {
    return useMutation({
        mutationFn: (data: CreateStaffPayload) => createStaff(data),
    });
}