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
    duration: number;
    createdAt: Date;
}