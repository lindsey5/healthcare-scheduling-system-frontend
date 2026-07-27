import { type AuthResponse } from "../types/auth.type";
import { apiAxios, HttpMethod } from "../api/apiAxios";

export interface LoginPayload {
    email: string;
    password: string;
}

export const authService = {
    login: (data: LoginPayload): Promise<AuthResponse> =>
        apiAxios<AuthResponse>("auth/login", {
            method: HttpMethod.POST,
            data,
        }),

    refreshAccessToken: (refreshToken : string): Promise<AuthResponse> => 
        apiAxios<AuthResponse>("auth/refreshToken", {
            method: HttpMethod.POST,
            data: { refreshToken }
        }),
};