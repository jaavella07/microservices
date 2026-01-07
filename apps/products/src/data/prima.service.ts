import { envs } from '../config';
import { PrismaClient } from '@prisma/client/extension';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      adapter: {
        url: envs.databaseUrl,
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }
  // private readonly logger = new Logger('PrismaService');

  // onModuleInit() {
  //   this.$connect();
  //   this.logger.log('Database connected');
  // }

  // // constructor() {
  // //   const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
  // //   super({ adapter });
  // // }
  // constructor() {
  //   super({
  //     adapter: {
  //       url: envs.databaseUrl,
  //     },
  //   });
  // }
}