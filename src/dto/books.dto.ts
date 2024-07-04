import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BooksDto {
  @ApiProperty({
    required: false,
    example: 'Laskar Pelangi',
    description: 'book title',
  })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: true, example: 'Dede', description: 'book author' })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    required: true,
    example: 2,
    description: 'book quantity',
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({ required: false, example: 'LG', description: 'book code' })
  @Type(() => String)
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty({ required: false, example: 'Aktif' })
  @Type(() => String)
  @IsOptional()
  @IsString()
  status?: string;
}
