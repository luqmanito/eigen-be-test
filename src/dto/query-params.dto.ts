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

export class QueryParams {
  @ApiProperty({
    required: false,
    description: 'input search keyword',
  })
  @Type(() => String)
  @IsOptional()
  @IsString()
  keyword?: string = '';

  @ApiProperty({
    required: false,
    example: 1,
    description: 'input page number',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    required: false,
    example: 10,
    description: 'input per_page shown',
  })
  @Type(() => Number)
  @IsInt()
  @Min(10)
  @IsOptional()
  per_page?: number = 10;

  @ApiProperty({
    required: false,
    example: false,
    description: 'decide show all data or not',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  is_all_data?: boolean = false;

  @ApiProperty({
    required: false,
    example: false,
    description: 'decide to show borrowed book or not',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  is_borrowed?: boolean = false;

  @ApiProperty({
    required: false,
    example: 'asc',
    description: 'sort data by asc or desc',
  })
  @IsEnum(SortOrder)
  @IsOptional()
  sort?: SortOrder = SortOrder.ASC;

  @ApiProperty({
    required: false,
    example: 'id',
    description: 'decide order by column ',
  })
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
