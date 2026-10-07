import type { Service } from "./service.type";
import type { DayOfWeek } from "./types";

export interface Doctor {
    id: number;
    firstname: string;
    lastname: string;
    status: "Active" | "Inactive";
    doctorServices?: DoctorService[];
    doctorSchedules?: DoctorSchedule[];
}

export interface DoctorService {
    id: number;
    doctorId: number;
    serviceId: number;
    service: Service;
}

export interface DoctorSchedule {
    id: number;
    doctorId: number;
    day: DayOfWeek;
    startTime: string;
    endTime: string;
}

export type DoctorSchedulePayload = {
    day: DayOfWeek;
    startTime: string;
    endTime: string;
};
