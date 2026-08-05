import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../lib/store/authStore";
import { authService } from "../services/AuthService";

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface UseSocketOptions {
    namespace: string;
    events?: { [event: string]: (...args: any[]) => void };
}

export const useSocket = ({ namespace, events = {} }: UseSocketOptions) => {
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

                // Register event listeners
                Object.entries(events).forEach(([event, callback]) => {
                    newSocket.on(event, callback);
                });

                setSocket(newSocket);
            }catch(error : any) {
                console.error("Error connecting to socket:", error.message);
            }
        }
        connectSocket();

        return () => {
            if(socket){
                Object.entries(events).forEach(([event]) => {
                    socket.off(event);
                });

                socket.disconnect();
            }
        };
    }, [accessToken]);

    return socket;
};