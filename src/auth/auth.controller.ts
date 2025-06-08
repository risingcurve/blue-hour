import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport'; // @nestjs/passport에서 AuthGuard 가져오기

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard('local')) // LocalStrategy 사용
  @Post('login')
  async login(@Request() req) { // req.user에 LocalStrategy의 validate 결과가 담겨있음
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt')) // JwtStrategy 사용 (토큰 인증 필요)
  @Get('profile')
  getProfile(@Request() req) { // req.user에 JwtStrategy의 validate 결과가 담겨있음
    return req.user;
  }
}