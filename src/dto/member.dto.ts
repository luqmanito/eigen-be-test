import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MemberDto {
  @ApiProperty({
    required: false,
    example: 'Raden',
    description: 'member name',
  })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

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
