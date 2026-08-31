export interface Patient {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: Date;
}