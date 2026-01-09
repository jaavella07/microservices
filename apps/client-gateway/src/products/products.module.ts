import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { envs, PRODUCTS_SERVICE } from '../config';
import { ProductsController } from './products.controller';


@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [

    ClientsModule.register([
      {
        name: PRODUCTS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.localhost_products,
          port: envs.port_products
        }
      },
    ]),

  ]
})
export class ProductsModule {

  // constructor(){
  //   console.log({envs})
  // }

}
