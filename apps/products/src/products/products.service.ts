import { Repository } from 'typeorm';
import { PaginationDto } from '../../common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

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
    try {
      const product = this.productRepository.create(createProductDto);
      const savedProduct = await this.productRepository.save(product);

      return savedProduct;

    } catch (error) {

      if (error.code === '23505') {
        throw new RpcException({
          status: 409,
          message: 'El producto ya existe en la base de datos',
        });
      }

      throw new RpcException({
        status: 500,
        message: `Error inesperado al crear el producto: ${error.message}`,
      });
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

  async findOne(id: string) {
    try {
      const product = await this.productRepository.findOne({
        where: { id, available: true }
      });

      if (!product) {
        throw new RpcException({
          status: 404,
          message: `Product with id #${id} not found`
        });
      }

      return product;

    } catch (error) {
      this.logger.error(`Error finding product with id ${id}:`, error);

      if (error instanceof RpcException) {
        throw error;
      }

      throw new RpcException({
        status: 500,
        message: `Error al buscar el producto: ${error.message}`
      });
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const { id: __, ...data } = updateProductDto;

      // Verificar que el producto existe
      await this.findOne(id);

      // Precargar el producto con los nuevos datos
      const product = await this.productRepository.preload({
        id,
        ...data
      });

      if (!product) {
        throw new RpcException({
          status: 404,
          message: `Product with id #${id} not found`
        });
      }

      // Guardar los cambios
      return await this.productRepository.save(product);

    } catch (error) {
      this.logger.error(`Error updating product with id ${id}:`, error);

      if (error instanceof RpcException) {
        throw error;
      }

      if (error.code === '23505') {
        throw new RpcException({
          status: 409,
          message: 'Ya existe un producto con ese nombre',
        });
      }

      throw new RpcException({
        status: 500,
        message: `Error al actualizar el producto: ${error.message}`
      });
    }
  }

  async remove(id: string) {
    try {
      // Verificar que el producto existe
      await this.findOne(id);

      // Soft delete - marcar como no disponible
      const product = await this.productRepository.preload({
        id,
        available: false
      });

      if (!product) {
        throw new RpcException({
          status: 404,
          message: `Product with id #${id} not found`
        });
      }

      return await this.productRepository.save(product);

    } catch (error) {
      this.logger.error(`Error removing product with id ${id}:`, error);

      if (error instanceof RpcException) {
        throw error;
      }

      throw new RpcException({
        status: 500,
        message: `Error al eliminar el producto: ${error.message}`
      });
    }
  }

  // async validateProducts(ids: number[]) {
  //   ids = Array.from(new Set(ids));

  //   const products = await this.productRepository.findBy({
  //     where: {
  //       id: {
  //         in: ids
  //       }
  //     }
  //   });

  //   if ( products.length !== ids.length ) {
  //     throw new RpcException({
  //       message: 'Some products were not found',
  //       status: HttpStatus.BAD_REQUEST,
  //     });
  //   }


  //   return products;

  // }


}