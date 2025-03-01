import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';
import { ApiError } from 'src/common/errors/api-error';
// Import your custom error class
// Import UsersService

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService, // Inject UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromHeader('authorization'), // Extract token from the 'authorization' header
            ignoreExpiration: false, // Ensure expired tokens are rejected
            secretOrKey: configService.get<string>('JWT_SECRET'), // Use JWT_SECRET from .env
        });
    }

    async validate(payload: any) {
        // Check if the payload contains the required fields
        if (!payload.sub || !payload.email) {
            throw new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid token payload');
        }

        // Check if the user exists in the database
        const user = await this.usersService.findByEmail(payload.email); // Use findByEmail
        if (!user) {
            throw new ApiError(HttpStatus.UNAUTHORIZED, 'User not found');
        }

        return { userId: payload.sub, email: payload.email };
    }
}
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//     constructor(private configService: ConfigService) {
//         super({
//             jwtFromRequest: ExtractJwt.fromHeader('authorization'),
//             // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             ignoreExpiration: false,
//             secretOrKey: configService.get<string>('JWT_SECRET'),
//         });
//     }

//     async validate(payload: any) {
//         return { userId: payload.sub, email: payload.email };
//     }
// }