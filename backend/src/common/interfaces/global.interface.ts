export interface GlobalResponse<T = any> {
    status: number;
    success: boolean;
    message: string;
    data: T | null;
}