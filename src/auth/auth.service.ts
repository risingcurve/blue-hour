import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto'; // 필요한 경우 임포트

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password !== null && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) { // user는 validateUser에서 반환된 객체
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto): Promise<any> {
    const existingUserByEmail = await this.usersService.findByEmail(registerDto.email);
    if (existingUserByEmail) {
      throw new UnauthorizedException('이미 등록된 이메일입니다.');
    }
    // 닉네임 중복 검사 (선택 사항)
    // const existingUserByNickname = await this.usersService.findByNickname(registerDto.nickname);
    // if (existingUserByNickname) {
    //   throw new UnauthorizedException('이미 사용 중인 닉네임입니다.');
    // }

    const newUser = await this.usersService.createUser(
      registerDto.email,
      registerDto.password,
      registerDto.nickname,
    );
    return this.login(newUser); // 회원가입 후 바로 로그인 토큰 발행
  }

}