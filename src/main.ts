import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = new ConfigService();
  const reflector = app.get(Reflector);

  app.useStaticAssets(join(__dirname, '..', 'public')); // access js, css, images
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // view
  app.setViewEngine('ejs');

  app.useGlobalPipes(new ValidationPipe()); // Validate
  app.useGlobalGuards(new JwtAuthGuard(reflector)); // Config use global AuthGuard

  //config CORS (Cross-Origin Resource Sharing)
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
    allowedHeaders: ['Content-Type'],
  });

  await app.listen(configService.get<string>('PORT') || 3001);
}
bootstrap();
