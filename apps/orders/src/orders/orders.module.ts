import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { envs } from '../config';
import { Order, OrderItem } from './entities';
import { OrdersService } from './orders.service';
import { PRODUCT_SERVICE } from '../config/services';
import { OrdersController } from './orders.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PRODUCT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.localhost_products,
          port: envs.port_products,
        }
      }
    ]),
    TypeOrmModule.forFeature([
      Order,
      OrderItem
    ])
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }
