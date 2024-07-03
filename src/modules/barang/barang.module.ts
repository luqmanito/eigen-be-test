import { Module } from '@nestjs/common';
import { BarangController } from './barang.controller';
import { BarangService } from './barang.service';

@Module({
  controllers: [BarangController],
  providers: [BarangService],
})
export class BarangModule {}
