import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    cors({
      origin: '*',
      method: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-xsrf-token'],
      exposedHeaders: ['Content-Type'],
    }),
  );
  const PORT = process.env.PORT;
  await app.listen(PORT, () => {
    console.log(`server is running in http://localhost:${PORT}`);
  });
}
bootstrap();
