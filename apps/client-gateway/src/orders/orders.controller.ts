import { ClientProxy } from '@nestjs/microservices';
import { Controller, Get, Inject, } from '@nestjs/common';

import { ORDERS_SERVICE } from '../config';



@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy,
  ) { }


  @Get()
  findAllProducts() {
    return
    { cmd: 'find_all_products' }

  }

  @Get(':id')
  async findOne() {
    return { cmd: 'find_one_product' };

  }


}