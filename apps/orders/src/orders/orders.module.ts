import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { envs } from '../config';
import { Order, OrderItem } from './entities';
import { OrdersService } from './orders.service';
import { NATS_SERVERS } from '../config/services';
import { OrdersController } from './orders.controller';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: NATS_SERVERS,
        transport: Transport.NATS,
        options: {
          servers: envs.nats_servers,
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
