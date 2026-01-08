import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger } from '@nestjs/common';

async function bootstrap() {

    const logger = new Logger('Main-Gateway');

    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');

    await app.listen(envs.port_gateway);
    logger.log(`Starting Client Gateway on port ${envs.port_gateway}...`); 
    
}
bootstrap();
