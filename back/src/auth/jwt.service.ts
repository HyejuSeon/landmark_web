import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as config from 'config';

const auth = config.get('auth');

@Injectable()
export class JwtService {
    async sign(id: string) {
        // jwt 토큰 생성
        const payload = { id };
        return jwt.sign(payload, auth['jwt_access_secret'], {
            algorithm: 'HS256',
            expiresIn: auth['jwt_access_expiresIn'],
        });
    }

    async verity(token: string) {
        // jwt 검증
        let decoded: any = null;
        try {
            decoded = jwt.verify(token, auth['jwt_access_secret']);
            return {
                // jwt 인증 성공
                status: true,
                id: decoded.id,
            };
        } catch (error) {
            return {
                status: false,
                message: error.message,
            };
        }
    }

    async refresh() {
        return jwt.sign({}, auth['jwt_refresh_secret'], {
            algorithm: 'HS256',
            expiresIn: auth['jwt_refresh_expiresIn'],
        });
    }
}
