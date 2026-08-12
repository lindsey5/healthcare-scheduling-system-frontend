
export type User = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    createdAt: string;
    role: string;
}

export type UpdateUserResponse = {
    message?: string;
    user: User;
}

export type UpdateUserPayload = {
    firstname: string;
    lastname: string;
}