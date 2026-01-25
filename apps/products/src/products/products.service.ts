import { Repository, In } from 'typeorm';
import { PaginationDto } from '../../common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name);
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

  ) { }

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 0, limit = 10 } = paginationDto;

    const [data, total] = await this.productRepository.findAndCount({
      where: { available: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    const lastPage = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        lastPage,
      },
    };
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id, available: true },
    });

    if (!product) {
      throw new RpcException({
        message: `Product with id #${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto;

    await this.findOne(id);
    await this.productRepository.update({ id }, data);
    return this.findOne(id);
  }

  async remove(id: string) {

    await this.findOne(id);
    await this.productRepository.update({ id }, { available: false });
    return this.findOne(id);
  }

  async validateProducts(ids: number[]) {

    ids = Array.from(new Set(ids));

    this.logger.log(`Validating products with IDs: ${ids.join(', ')}`);
    const products = await this.productRepository.find({
      where: {
        id: In(ids),
        available: true, // Solo productos disponibles
      },
    });

    this.logger.log(`Found ${products.length} products out of ${ids.length} requested`);

    if (products.length !== ids.length) {
      throw new RpcException({
        message: 'Some products were not found',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return products;
  }
}