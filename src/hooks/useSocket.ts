import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../lib/store/authStore";
import { authService } from "../services/AuthService";

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface UseSocketOptions {
    namespace: string;
}

export const useSocket = ({ namespace }: UseSocketOptions) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { accessToken, refreshToken, setAuth } = useAuthStore();
    
    useEffect(() => {
        if (!accessToken) return;

        const connectSocket = () => {
            try{
                const newSocket = io(`${SOCKET_URL}${namespace}`, {
                    auth: { token: `Bearer ${accessToken}` },
                });

                newSocket.on("connect", () => console.log("Connected to socket"))
                
                newSocket.on("connect_error", async () => {
                    const data = await authService.refreshAccessToken(refreshToken || "");
                    setAuth(data.token.accessToken, data.token.refreshToken);
                })


                setSocket(newSocket);
            }catch(error : any) {
                console.error("Error connecting to socket:", error.message);
            }
        }
        connectSocket();

        return () => {
            if(socket){
                socket.disconnect();
            }
        };
    }, [accessToken]);

    return socket;
};