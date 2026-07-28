export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginationResponse {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
}