import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {

  async findAll() {
    return {
      messages: 'findAll'
    }
  }

  async findOne() {
    return {
      messages: 'findAll'
    }

  }
}
