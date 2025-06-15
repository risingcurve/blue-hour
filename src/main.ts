import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,         // DTO에 정의되지 않은 속성 자동 제거 (보안 강화)
    forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있으면 에러 발생 (오타 등 방지)
    transform: true,         // 요청 페이로드를 DTO 타입 인스턴스로 자동 변환 (필수)
  }));
  
  app.enableCors({
    origin: 'http://localhost:3001', // React 앱이 실행되는 포트
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();