import { Column,  Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity('order_items')
export class OrderItem {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('int')
    productId: number;

    @Column('int')
    quantity: number;

    @Column('decimal')
    price: number;

    @ManyToOne(() => Order, (order) => order.orderItems)
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @Column({ nullable: true })
    orderId: string;
}