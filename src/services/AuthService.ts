import { type AuthResponse } from "../types/auth.type";
import { apiAxios, HttpMethod } from "../api/apiAxios";

export const authService = {
    refreshAccessToken: (refreshToken : string): Promise<AuthResponse> => 
        apiAxios<AuthResponse>("/api/auth/refreshToken", {
            method: HttpMethod.POST,
            data: { refreshToken }
        }),
};