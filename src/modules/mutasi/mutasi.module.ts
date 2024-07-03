import { Module } from '@nestjs/common';
import { MutasiController } from './mutasi.controller';
import { MutasiService } from './mutasi.service';
import { ApiService } from 'src/common/api/api.service';


@Module({
  controllers: [MutasiController],
  providers: [MutasiService,ApiService],
})
export class mutasiModule {}
