import { ApiError } from './api-error';
import { ValidationError } from 'class-validator';

export const handleValidationError = (error: ValidationError): ApiError => {
    const messages = Object.values(error.constraints).join(', ');
    return new ApiError(400, `Validation failed: ${messages}`);
};