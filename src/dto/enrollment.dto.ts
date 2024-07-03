import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { pengguna_type } from '@prisma/client';

export class EnrollmentDto {
  @ApiProperty({ required: true, example: 1 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  id_barang: number;

  @ApiProperty({ required: true, example: 1 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  id_gedung: number;

  @ApiProperty({ required: true, example: '1' })
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  id_ruang: string;

  @ApiProperty({ required: true, example: 1 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  id_cabang: number;

  @ApiProperty({ required: true, example: 'KARYAWAN' })
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  jenis_pengguna: pengguna_type;

  @ApiProperty({ required: true, example: '327701616165161' })
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  nik_pengguna?: string;

  @ApiProperty({ required: false, example: 'Aktif' })
  @Type(() => String)
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: true, example: 'rusak' })
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  kondisi: string;

  @ApiProperty({ required: true, example: '2022-02-01T00:00:00Z' })
  @IsNotEmpty()
  @ApiProperty()
  tanggal_enrollment: Date;
}

export class UpdateEnrollmentDto {
  @ApiProperty({ required: true, example: 1 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsString()
  id_barang: number;

  @ApiProperty({ required: true, example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  id_gedung: number;

  @ApiProperty({ required: true, example: '1' })
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  id_ruang: string;

  @ApiProperty({ required: true, example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  id_cabang: number;

  @ApiProperty({ required: true, example: 'KARYAWAN' })
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  jenis_pengguna: pengguna_type;

  @ApiProperty({ required: true, example: '327701616165161' })
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  nik_pengguna?: string;

  @ApiProperty({ required: false, example: 'Aktif' })
  @Type(() => String)
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: true, example: 'rusak' })
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  kondisi: string;

  @ApiProperty({ required: true, example: '2022-02-01T00:00:00Z' })
  @IsNotEmpty()
  @ApiProperty()
  tanggal_input: Date;
}
