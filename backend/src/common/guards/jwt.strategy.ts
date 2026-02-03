import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ClientDao } from '@/modules/client/dao/client.dao';

export interface JwtPayload {
    sub: string; // client ID
    document: string;
    phone: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private clientDao: ClientDao,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key-change-in-production',
        });
    }

    async validate(payload: JwtPayload) {
        // Verify client still exists
        const client = await this.clientDao.findById(payload.sub);

        if (!client) {
            throw new UnauthorizedException('Invalid token');
        }

        // Return user data to be attached to request
        return {
            id: payload.sub,
            document: payload.document,
            phone: payload.phone,
        };
    }
}
