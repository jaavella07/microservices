import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaService } from './data/prima.service';


@Module({
  imports: [],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
  
})
export class ProductsModule { }
