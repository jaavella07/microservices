import { Injectable, NotFoundException } from '@nestjs/common';

import { PaginationDto } from '../../common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {


  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

  ) { }

  create(createProductDto: CreateProductDto) {

    const { name, price } = createProductDto
    return this.productRepository.create({
      name,
      price
    });

  }

  async findAll(paginationDto: PaginationDto) {

    const { page = 0, limit = 10 } = paginationDto;

    const totalPages = await this.productRepository.count({ where: { available: true } });
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.productRepository.find({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          available: true
        }
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      }
    }
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id, available: true }
    });

    if (!product) {
      throw new NotFoundException(`Product with id #${id} not found`);
    }

    return product;

  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { } = updateProductDto
    const { id: __, ...data } = updateProductDto; // __ renombrar id para no usarlo

    await this.findOne(id);

    return this.productRepository.preload({

      ...data

    });
  }

  async remove(id: number) {

    await this.findOne(id);
    // return this.product.delete({
    //   where: { id }
    // });
    const product = await this.productRepository.preload({
      id,
      available: false
    });

    return product;

  }
}