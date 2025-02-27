import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            throw new UnauthorizedException('Invalid or expired token'); // Throw UnauthorizedException for invalid/expired tokens
        }
        return user;
    }
}