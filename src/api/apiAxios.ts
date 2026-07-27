import axiosClient from "./axiosClient";

export const HttpMethod = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
};

export type HttpMethod = typeof HttpMethod[keyof typeof HttpMethod];

interface ApiOptions {
    method?: HttpMethod;
    data?: any;
    params?: Record<string, any>;
    headers?: Record<string, string>;
}

export async function apiAxios<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    const { method = HttpMethod.GET, data, params, headers } = options || {};

    const isFormData = data instanceof FormData;

    const res = await axiosClient.request<T>({
        url: endpoint,
        method,
        data,
        params,
        headers: {
        ...(headers || {}),
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        },
    });
    
    return res.data;
}