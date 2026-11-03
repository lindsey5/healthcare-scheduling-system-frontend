export interface Service {
    id: number;
    serviceName: string;
    dayOfWeek:
        | "Monday"
        | "Tuesday"
        | "Wednesday"
        | "Thursday"
        | "Friday"
    startTime: string;
    endTime: string;
    doctorServices?: ServiceDoctorAssignment[];
}

export interface ServiceDoctorAssignment {
    id: number;
    doctorId: number;
    serviceId: number;
    startTime: string;
    endTime: string;
    doctor: {
        id: number;
        firstname: string;
        lastname: string;
    };
}