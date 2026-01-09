import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('products')
export class Product {

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('varchar')
  name: string;

  @Column()
  price: number;

  @Column({ default: true })
  available: boolean;


  @CreateDateColumn({
    name: 'created_at', 
    type: 'timestamptz', 
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

}