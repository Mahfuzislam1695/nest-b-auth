import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiError } from 'src/common/errors/api-error';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any) {
        // Handle JWT errors
        if (err || !user) {
            throw new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid or expired token');
        }

        return user;
    }
}
// import { Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') { }