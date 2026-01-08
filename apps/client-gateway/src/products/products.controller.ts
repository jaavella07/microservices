import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';


@Controller('products')
export class ProductsController {
  constructor() { }

  @Post()
  createProduct() {
    return { message: 'Product created' };
  }
  @Get()
  findAllProducts() {
    return { message: 'List of products' };
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
