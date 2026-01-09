import { PRODUCTS_SERVICE } from '../config';
import { ClientProxy } from '@nestjs/microservices';
import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';

import { PaginationDto } from 'apps/products/common';
import { CreateProductDto } from 'apps/products/src/products/dto/create-product.dto';


@Controller('products')
export class ProductsController {

  constructor(
    @Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy,
  ) { }

  @Post()
  createProduct(@Body() createProductDto:CreateProductDto ) {
    return this.productsClient.send({ cmd: 'create_product' },createProductDto)
  }
  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto ) {
    return this.productsClient.send({ cmd: 'find_all_products' },paginationDto)
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return { message: 'List of products' + id };
  }
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return { message: 'Delete of products' + id };
  }
  @Patch(':id')
  patchProduct(@Param('id') id: string, @Body() body: any) {
    return { message: 'Update of products' + id };
  }

}
