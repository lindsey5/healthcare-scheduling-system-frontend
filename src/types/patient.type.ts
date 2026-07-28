export interface Patient {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    isVerified: boolean;
    createdAt: Date;
}