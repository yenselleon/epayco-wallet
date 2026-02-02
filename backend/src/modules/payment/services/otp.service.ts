import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
    /**
     * Generate a random 6-digit OTP token
     * @returns Object with token
     */
    generateOtp(): { token: string } {
        // Generate a random 6-digit number
        const token = Math.floor(100000 + Math.random() * 900000).toString();
        return { token };
    }

    /**
     * Hash a token for secure storage
     * @param token - The token to hash
     * @returns Hashed token
     */
    hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    /**
     * Verify a token against a hashed token
     * @param token - The plain token
     * @param hashedToken - The hashed token to compare against
     * @returns boolean indicating if tokens match
     */
    verifyToken(token: string, hashedToken: string): boolean {
        const hash = this.hashToken(token);
        return hash === hashedToken;
    }
}
