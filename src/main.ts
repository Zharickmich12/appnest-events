import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true,
    forbidNonWhitelisted: true, // lanza error si llega un campo inesperado
      transform: true, // transforma automáticamente tipos al DTO
  }))

  const port = process.env.PORT || 3000;
  
  await app.listen(port);

  console.log(`Application running on: http://localhost:${port}`)
}
bootstrap();
