import { Injectable, CanActivate, ExecutionContext, ForbiddenException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiError } from 'src/common/errors/api-error';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        console.log('RolesGuard - Request User:', request.user); // Debugging
        console.log('RolesGuard - Required Roles:', requiredRoles); // Debugging

        if (!user || !requiredRoles.includes(user.role)) {
            throw new ApiError(HttpStatus.FORBIDDEN, 'You do not have permission to access this resource');
        }

        return true;
    }
}

// import { Injectable, CanActivate, ExecutionContext, ForbiddenException, HttpStatus } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { ApiError } from 'src/common/errors/api-error';

// @Injectable()
// export class RolesGuard implements CanActivate {
//     constructor(private reflector: Reflector) { }

//     canActivate(context: ExecutionContext): boolean {
//         const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
//         if (!requiredRoles) {
//             return true;
//         }

//         const request = context.switchToHttp().getRequest();
//         const user = request.user;

//         console.log("user:", user); // Debugging


//         if (!requiredRoles.includes(user.role)) {
//             throw new ApiError(HttpStatus.FORBIDDEN, 'You do not have permission to access this resource');
//         }

//         return true;
//     }
// }

// function matchRoles(roles: string[], roles1: any): boolean {
//     throw new Error('Function not implemented.');
// }
// import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Role } from '@prisma/client'; // Import Role enum from Prisma
// import { ApiError } from 'src/common/errors/api-error';
// // Import your custom error

// @Injectable()
// export class RolesGuard implements CanActivate {
//     constructor(private reflector: Reflector) { }

//     canActivate(context: ExecutionContext): boolean {
//         const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());
//         if (!requiredRoles) {
//             return true; // No roles required, allow access
//         }

//         const request = context.switchToHttp().getRequest();
//         const user = request.user;

//         if (!user) {
//             throw new ApiError(HttpStatus.UNAUTHORIZED, 'User not authenticated');
//         }

//         if (!requiredRoles.includes(user.role)) {
//             throw new ApiError(HttpStatus.FORBIDDEN, 'You do not have permission to access this resource');
//         }

//         return true;
//     }
// }