// src/auth/strategies/jwt.strategy.ts

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    // 여기가 수정되어야 합니다: secret이 string | undefined 일 수 있는 문제 해결
    const secret = configService.get<string>('JWT_SECRET') ?? 'your_super_secret_fallback_key'; // 강력한 비밀키로 교체 필요
    if (secret === 'your_super_secret_fallback_key') {
        console.warn('WARNING: JWT_SECRET environment variable is not set. Using a default fallback key. This is HIGHLY INSECURE for production!');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // 이제 'secret' 변수는 string 타입입니다.
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}