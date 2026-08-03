import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Staff } from "../../types/staff.type";

interface GetStaffsParams {
    search?: string;
}

interface GetStaffsResponse {
    staffs: Staff[];
}

const getStaffs = (params: GetStaffsParams) =>
    apiAxios<GetStaffsResponse>("/api/staffs", {
        method: "GET",
        params,
    });

export default function useGetStaffs(params: GetStaffsParams) {
    return useQuery<GetStaffsResponse, Error>({
        queryKey: ["staffs", params],
        queryFn: () => getStaffs(params),
        refetchOnWindowFocus: false,
    });
}