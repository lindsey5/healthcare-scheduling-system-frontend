import type { Service } from "./service.type";

export interface Doctor {
    id: number;
    firstname: string;
    lastname: string;
    status: "Active" | "Inactive";
    doctorServices: DoctorService[];
}

export interface DoctorService {
    id: number;
    doctorId: number;
    serviceId: number;
    service: Service;
}