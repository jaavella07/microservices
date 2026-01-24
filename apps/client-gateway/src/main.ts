import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { RpcCustomExceptionFilter } from './common';

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

    app.useGlobalFilters(new RpcCustomExceptionFilter())
    
    await app.listen(envs.port_gateway);
    logger.log(`Client Gateway running on port ${envs.port_gateway}...`);

}
bootstrap();
