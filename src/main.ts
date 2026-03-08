import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';
import { CustomValidationPipe } from './core/validate.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  //config version link
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2']
  });

  // CORS
  app.enableCors(
    {
      "origin": true,
      "methods": "GET, HEAD, PUT, PATCH, POST, DELETE",
      "preflightContinute": false,
      credential: true
    }
  )
  await app.listen(configService.get('PORT')!);

}
bootstrap();

