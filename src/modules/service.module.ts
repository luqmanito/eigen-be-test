import { Module } from '@nestjs/common';
import { BarangModule } from './barang/barang.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { mutasiModule } from './mutasi/mutasi.module';

@Module({
  imports: [BarangModule, EnrollmentModule, mutasiModule],
})
export class ServiceModule {}
