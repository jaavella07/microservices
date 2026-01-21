import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env',
        'apps/client-gateway/.env',
      ],
    }),
    ProductsModule,
    OrdersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
