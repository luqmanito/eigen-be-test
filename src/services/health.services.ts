import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller()
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly health: HealthCheckService
    ) {}

  @Get('/health')
  @HealthCheck()
  getHealth() {
    return this.health.check([
      () => this.prisma.isHealthy()
    ]);
  }
}
