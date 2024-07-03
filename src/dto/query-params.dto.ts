import { Type, Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { SortOrder } from './request-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { mutation_type } from '@prisma/client';

export class QueryParams {
  @ApiProperty({ required: false })
  @Type(() => String)
  @IsOptional()
  @IsString()
  keyword?: string = '';

  @ApiProperty({ required: false })
  @Type(() => String)
  @IsOptional()
  @IsString()
  tgl_awal?: string = '';

  @ApiProperty({ required: true, example: 'MUTASI' })
  @Type(() => String)
  @IsOptional()
  @IsString()
  type: mutation_type;

  @ApiProperty({ required: false })
  @Type(() => String)
  @IsOptional()
  @IsString()
  tgl_akhir?: string = '';

  @ApiProperty({ required: false, example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false, example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(10)
  @IsOptional()
  per_page?: number = 10;

  @ApiProperty({ required: false, example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  kategori_id?: number;

  @ApiProperty({ required: false, example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  cabang_id?: number;

  @ApiProperty({ required: false, example: ['4,5'] })
  @Type(() => String)
  @IsString()
  @IsOptional()
  barang_ids?: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  gedung_ids?: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  ruang_id?: string;

  @ApiProperty({ required: false, example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  gedung_id?: number;

  @ApiProperty({ required: false, example: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  is_all_data?: boolean = false;

  @ApiProperty({ required: false, example: 'asc' })
  @IsEnum(SortOrder)
  @IsOptional()
  sort?: SortOrder = SortOrder.ASC;

  @ApiProperty({ required: false, example: 'id' })
  @Type(() => String)
  @IsOptional()
  @IsString()
  order_by?: string = 'id';

  constructor(keyword = '', page = 1, sort = SortOrder.ASC) {
    this.keyword = keyword;
    this.page = page;
    this.sort = sort;
  }
}
