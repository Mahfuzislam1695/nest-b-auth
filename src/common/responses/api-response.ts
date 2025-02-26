export interface IApiResponse<T> {
    statusCode: number;
    success: boolean;
    message?: string;
    data?: T;
}