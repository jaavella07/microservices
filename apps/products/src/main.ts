import { envs } from './config';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {

  // console.log(envs.nats_servers)
  const logger = new Logger('MicroServices-Products');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.nats_servers,
      }
    },
  );
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  await app.listen();
  logger.log(`Products Microservice running on port ${envs.nats_servers}`);

}
bootstrap();

