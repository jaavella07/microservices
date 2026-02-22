import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderItem } from "./orderItem.entity";


export enum OrderStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}


@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal')
    totalAmount: number;

    @Column('int')
    totalItems: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @Column({ default: false })
    paid: boolean;

    @Column('timestamp', { nullable: true })
    paidAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    orderItems: OrderItem[];

}