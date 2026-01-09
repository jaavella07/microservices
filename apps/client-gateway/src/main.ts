import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {

    const logger = new Logger('Main-Gateway');

    const app = await NestFactory.create(AppModule);
    
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        })
    );
    await app.listen(envs.port_gateway);
    logger.log(`Starting Client Gateway on port ${envs.port_gateway}...`);

}
bootstrap();
