import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AttachUserMiddleware implements NestMiddleware {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private usersService: UsersService,
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            try {
                const payload = this.jwtService.verify(token, {
                    secret: this.configService.get<string>('JWT_SECRET'),
                });
                const user = await this.usersService.findByEmail(payload.email);
                if (user) {
                    req.user = user; // Attach the user to the request
                }
            } catch (err) {
                // Token is invalid or expired
                console.error('Error verifying token:', err.message);
            }
        }
        next();
    }
}