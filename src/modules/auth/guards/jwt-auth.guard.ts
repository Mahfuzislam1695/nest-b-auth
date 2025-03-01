import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiError } from 'src/common/errors/api-error';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any) {
        console.log('JwtAuthGuard - User:', user); // Debugging
        console.log('JwtAuthGuard - Error:', err); // Debugging
        console.log('JwtAuthGuard - Info:', info); // Debugging

        if (err || !user) {
            throw new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid or expired token');
        }

        return user;
    }
}
// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
//     handleRequest(err: any, user: any, info: any) {
//         console.log('JwtAuthGuard - User:', user); // Debugging
//         console.log('JwtAuthGuard - Error:', err); // Debugging
//         console.log('JwtAuthGuard - Info:', info); // Debugging

//         // Handle JWT errors
//         if (err || !user) {
//             throw new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid or expired token');
//         }

//         // If the token is valid, return the user object
//         return user;
//     }
// }