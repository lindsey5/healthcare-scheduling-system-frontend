import type { Service } from "./service.type";

export interface Doctor {
    id: number;
    firstname: string;
    lastname: string;
    status: "Active" | "Inactive";
    offeredServices?: DoctorOfferedService[];
    doctorServices?: DoctorService[];
}

export interface DoctorOfferedService {
    doctorId: number;
    serviceId: number;
    service: Service;
}

export interface DoctorService {
    id: number;
    doctorId: number;
    serviceId: number;
    service: Service;
    startTime: string;
    endTime: string;
}
