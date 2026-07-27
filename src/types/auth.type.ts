
export interface AuthState {
    user: any;
    accessToken: string | null
    refreshToken: string | null

    setAuth: (accessToken: string, refreshToken: string) => void
    setUser: (user : any) => void
    isAuthenticated: () => boolean
    logout: () => void
}

export interface AuthResponse { 
    user: any;
    token: {
        accessToken: string
        refreshToken: string
    }
}