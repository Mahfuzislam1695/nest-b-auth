import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';
import { ApiError } from 'src/common/errors/api-error';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Ensure this is correct
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        const user = await this.usersService.findByEmail(payload.email);
        if (!user) {
            throw new ApiError(HttpStatus.UNAUTHORIZED, 'User not found');
        }
        return user; // Return the entire user object
    }
}
// import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';
// import { UsersService } from 'src/modules/users/users.service';
// import { ApiError } from 'src/common/errors/api-error';


// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//     constructor(
//         private configService: ConfigService,
//         private usersService: UsersService, // Inject UsersService
//     ) {
//         super({
//             // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from the 'authorization' header
//             jwtFromRequest: ExtractJwt.fromHeader('authorization'), // Extract token from the 'authorization' header
//             ignoreExpiration: false, // Ensure expired tokens are rejected
//             secretOrKey: configService.get<string>('JWT_SECRET'), // Use JWT_SECRET from .env
//         });
//     }


//     async validate(payload: any) {
//         console.log('JWT Payload:', payload); // Debugging

//         if (!payload.sub || !payload.email || !payload.role) {
//             throw new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid token payload');
//         }

//         const user = await this.usersService.findByEmail(payload.email);
//         console.log('User from DB:', user); // Debugging

//         if (!user) {
//             throw new ApiError(HttpStatus.UNAUTHORIZED, 'User not found');
//         }
//         // return user;


//         return {
//             userId: payload.sub,
//             email: payload.email,
//             role: payload.role,
//         };
//     }


// }