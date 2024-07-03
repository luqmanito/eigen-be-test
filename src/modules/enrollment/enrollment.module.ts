import { Module } from '@nestjs/common';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentService } from './enrollment.service';
import { ApiService } from 'src/common/api/api.service';


@Module({
  controllers: [EnrollmentController],
  providers: [EnrollmentService, ApiService],
})
export class EnrollmentModule {}
