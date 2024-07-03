import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { mutation_type, pengguna_type } from '@prisma/client';

export class MutasiDto {
  @ApiProperty({ required: true, example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  id_gedung_asal: number;

  @ApiProperty({ required: true, example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  id_gedung_tujuan: number;

  @ApiProperty({ required: true, example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  id_cabang_asal: number;

  @ApiProperty({ required: true, example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  id_cabang_tujuan: number;

  @ApiProperty({ required: true, example: 3 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  id_dokumen: number;

  @ApiProperty({ required: true, example: 2 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  id_barang: number;

  @ApiProperty({ required: true, example: 'MUTASI' })
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  type: mutation_type;

  @ApiProperty({ required: true, example: 'kebutuhan unit baru' })
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  keterangan?: string;

  @ApiProperty({ required: true, example: false })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  is_selesai_mutasi: boolean;

  @ApiProperty({ required: true, example: '2022-02-01T00:00:00Z' })
  @IsNotEmpty()
  @ApiProperty()
  tanggal_mutasi: Date;
}
