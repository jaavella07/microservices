import { Module } from '@nestjs/common';

import { ProductsController } from './products.controller';
import { NatsModule } from '../transport/nats.module';


@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [NatsModule]
})
export class ProductsModule {

  // constructor(){
  //   console.log({envs})
  // }

}
