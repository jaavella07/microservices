import { Repository } from 'typeorm';
import { PaginationDto } from '../../common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {


  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

  ) { }


  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      return await this.productRepository.save(product);

    } catch (error) {

      if (error.code === '23505') {
        throw new ConflictException('El producto ya existe en la base de datos');
      }

      throw new InternalServerErrorException('Error inesperado, revise los logs del servidor');
    }
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