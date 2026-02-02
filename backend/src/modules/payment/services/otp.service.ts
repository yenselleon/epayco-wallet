import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {

    generateOtp(): { token: string } {
        const token = Math.floor(100000 + Math.random() * 900000).toString();
        return { token };
    }

    hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    verifyToken(token: string, hashedToken: string): boolean {
        const hash = this.hashToken(token);
        return hash === hashedToken;
    }
}
