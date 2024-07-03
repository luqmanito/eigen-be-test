import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './common/logger/logger.module';
import { HealthController } from './services';
import { LoggerService } from './common/logger/logger.service';
import { ServiceModule } from './modules/service.module';


@Module({
  imports: [
    TerminusModule.forRoot({
      gracefulShutdownTimeoutMs: 1000,
    }),
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    ServiceModule,

  ],
  controllers: [HealthController],
  providers: [LoggerService],
})
export class AppModule {}
