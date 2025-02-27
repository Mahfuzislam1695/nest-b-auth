import { ApiError } from './api-error';

export const handleDatabaseError = (error: any): ApiError => {
    // Handle unique constraint violations
    if (error.code === 'P2002') {
        return new ApiError(409, 'Duplicate record found.');
    }

    // Handle record not found errors
    if (error.code === 'P2025') {
        return new ApiError(404, 'Record not found.');
    }

    // Handle other database errors
    return new ApiError(500, 'Database error occurred.');
};