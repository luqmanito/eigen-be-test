import { INestApplication, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { HealthIndicatorResult } from '@nestjs/terminus';
import { PRISMA_CLIENT_OPTIONS } from './prisma.config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  // constructor() {
  //   super(PRISMA_CLIENT_OPTIONS);
  // }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on(<never>'beforeExit', async () => {
      await app.close()
    })
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      await this.$queryRaw`SELECT 1`
      return Promise.resolve({
        database: {
          status: 'up'
        }
      })
    } catch (error) {
      return Promise.resolve({
        database: {
          status: 'down'
        }
      })
    }
  }
}