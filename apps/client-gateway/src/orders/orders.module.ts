import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { envs, ORDER_SERVICE } from '../config';
import { OrdersController } from './orders.controller';


@Module({
  controllers: [OrdersController],
  providers: [],
  imports: [

    ClientsModule.register([
      {
        name: ORDER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.localhost_orders,
          port: envs.port_orders
        }
      },
    ]),
  ],

})
export class OrdersModule {
}
