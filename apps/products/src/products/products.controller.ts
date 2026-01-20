import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller, Get, ParseIntPipe, Post } from '@nestjs/common';

import { PaginationDto } from '../../common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // @Post()
  @MessagePattern({ cmd: 'create_product' })
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // @Get()
  @MessagePattern({ cmd: 'find_all_products' })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @MessagePattern({ cmd: 'find_one_product' })
  findOne(@Payload('id') id: string) {
    return this.productsService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_product' })
  update(@Payload() payload: { id: string; updateProductDto: UpdateProductDto }) {
    const { id, updateProductDto } = payload;
    return this.productsService.update(id, updateProductDto);
  }

  @MessagePattern({ cmd: 'delete_product' })
  remove(@Payload('id') id: string) {
    return this.productsService.remove(id);
  }
}