
export interface AuthState {
    user: any;
    accessToken: string | null
    refreshToken: string | null

    setAuth: (accessToken: string, refreshToken: string) => void
    setUser: (user : any) => void
    isAuthenticated: () => boolean
    logout: () => void
}

export type LoginPayload = {
    email: string;
    password: string;
}

export type AuthResponse = {
    user: User,
    token: {
        refreshToken: string;
        accessToken: string;
    },
    message?: string;
}

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    createdAt: string;
    role: string;
}