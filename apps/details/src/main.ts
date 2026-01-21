import { NestFactory } from '@nestjs/core';
import { DetailsModule } from './details.module';

async function bootstrap() {
  const app = await NestFactory.create(DetailsModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
