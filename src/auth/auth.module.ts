import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // UsersModule import
import { LocalStrategy } from './strategies/local.strategy'; // 곧 생성
import { JwtStrategy } from './strategies/jwt.strategy'; // 곧 생성
import { ConfigModule, ConfigService } from '@nestjs/config'; // 환경 변수 사용을 위해

@Module({
  imports: [
    UsersModule, // UsersService를 사용하기 위해
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // ConfigModule을 통해 환경 변수 주입
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // .env 파일에서 JWT_SECRET을 가져옴
        signOptions: { expiresIn: '60m' }, // 토큰 만료 시간
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy], // 전략 등록
  controllers: [AuthController],
})
export class AuthModule {}