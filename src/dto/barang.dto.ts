import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Prisma, pengadaan_type } from '@prisma/client';

export class BarangDto {
  @ApiProperty({ required: true, example: 1 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  id_kategori: number;

  @ApiProperty({ required: false, example: 'Laptop Hp' })
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  nama_barang: string;

  @ApiProperty({ required: true, example: 'HP1515' })
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  tipe_barang: string;

  @ApiProperty({ required: true, example: 'MUTASI' })
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  jenis_pengadaan: pengadaan_type;

  @ApiProperty({
    required: true,
    example: 4329,
    description: 'item price',
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  harga_barang: number;

  @ApiProperty({ required: false, example: 'LG' })
  @Type(() => String)
  @IsOptional()
  @IsString()
  merk: string;

  @ApiProperty({ required: false, example: 'INTRACS' })
  @Type(() => String)
  @IsOptional()
  @IsString()
  vendor: string;

  @ApiProperty({ required: false, example: 'Aktif' })
  @Type(() => String)
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false, example: 'Aktif' })
  @Type(() => String)
  @IsOptional()
  @IsString()
  spesifikasi: string;

  @ApiProperty({ required: true, example: '2022-02-01T00:00:00Z' })
  @IsNotEmpty()
  @ApiProperty()
  tanggal_pengadaan: Date;
}

export class KategoriDto {
  @ApiProperty({ required: true, example: 'ATK' })
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  nama_kategori?: string;

  @ApiProperty({ required: false, example: 'Aktif' })
  @Type(() => String)
  @IsOptional()
  @IsString()
  status: string;
}
