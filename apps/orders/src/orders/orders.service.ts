import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';

import { ChangeOrderStatusDto } from './dto';
import { Order } from './entities/order.entity';
import { PRODUCT_SERVICE } from '../config/services';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItem } from './entities/orderItem.entity';
import { OrderPaginationDto } from './dto/order-pagination.dto';



@Injectable()
export class OrdersService {

  private readonly logger = new Logger('OrdersService');

  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

  ) { }

  async create(createOrderDto: CreateOrderDto) {
    
    try {
      // 1. Confirmar los ids de los productos
      const productIds = createOrderDto.items.map((item) => item.productId);
      this.logger.log(`Validating products: ${productIds.join(', ')}`);

      const products: any[] = await firstValueFrom(
        this.productsClient.send({ cmd: 'validate_products' }, productIds),
      );

      this.logger.log(`Products validated: ${products.length} products found`);
      // 2. Cálculos de los valores
      const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
        const price = products.find(
          (product) => product.id === orderItem.productId,
        ).price;
        return acc + (price * orderItem.quantity);
      }, 0);

      const totalItems = createOrderDto.items.reduce((acc, orderItem) => {
        return acc + orderItem.quantity;
      }, 0);

      this.logger.log(`Order totals - Amount: ${totalAmount}, Items: ${totalItems}`);

      // 3. Crear una transacción de base de datos con TypeORM
      const queryRunner = this.orderRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Crear la orden
        const order = this.orderRepository.create({
          totalAmount: totalAmount,
          totalItems: totalItems,
        });

        this.logger.log('Saving order...');
        const savedOrder = await queryRunner.manager.save(order);
        this.logger.log(`Order saved with ID: ${savedOrder.id}`);

        // Crear los items de la orden
        const orderItems = createOrderDto.items.map((orderItem) => {
          const orderItemEntity = this.orderItemRepository.create({
            price: products.find(
              (product) => product.id === orderItem.productId,
            ).price,
            productId: orderItem.productId,
            quantity: orderItem.quantity,
            order: savedOrder,
          });
          return orderItemEntity;
        });

        this.logger.log(`Saving ${orderItems.length} order items...`);
        await queryRunner.manager.save(orderItems);

        await queryRunner.commitTransaction();
        this.logger.log('Transaction committed successfully');

        // Cargar la orden con sus items
        const orderWithItems = await this.orderRepository.findOne({
          where: { id: savedOrder.id },
          relations: ['orderItems'],
        });

        if (!orderWithItems) {
          throw new RpcException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Failed to load created order',
          });
        }

        return {
          ...orderWithItems,
          orderItems: orderWithItems.orderItems.map((orderItem) => ({
            price: orderItem.price,
            quantity: orderItem.quantity,
            productId: orderItem.productId,
            name: products.find((product) => product.id === orderItem.productId)
              .name,
          })),
        };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Check logs',
      });
    }
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const { page = 1, limit = 10, status } = orderPaginationDto;

    const where = status ? { status } : {};

    const [data, total] = await this.orderRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderItems'],
    });

    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`,
      });
    }

    const productIds = order.orderItems.map((orderItem) => orderItem.productId);
    const products: any[] = await firstValueFrom(
      this.productsClient.send({ cmd: 'validate_products' }, productIds),
    );

    return {
      ...order,
      orderItems: order.orderItems.map((orderItem) => ({
        price: orderItem.price,
        quantity: orderItem.quantity,
        productId: orderItem.productId,
        name: products.find((product) => product.id === orderItem.productId)
          .name,
      })),
    };
  }

  async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;

    const order = await this.findOne(id);
    if (order.status === status) {
      return order;
    }

    await this.orderRepository.update({ id }, { status });

    return this.findOne(id);
  }
}