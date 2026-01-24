import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersModule } from './orders/orders.module';


@Module({
  imports: [
    OrdersModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST_ORDERS,
          port: +(process.env.DB_PORT_ORDERS || 5432),
          database: process.env.DB_NAME_ORDERS,
          username: process.env.DB_USERNAME_ORDERS,
          password: process.env.DB_PASSWORD_ORDERS,
          entities: [OrdersModule],
          autoLoadEntities: true,
          synchronize: true,
        }),
  ]

})
export class AppModule { }
