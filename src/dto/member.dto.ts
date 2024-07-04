import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MemberDto {
  @ApiProperty({
    required: true,
    example: 'Raden',
    description: 'Input member name',
  })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    example: 'M001',
    description: 'Input member code',
  })
  @Type(() => String)
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty({
    required: false,
    example: 'Active',
    description: 'Input member status',
  })
  @Type(() => String)
  @IsOptional()
  @IsString()
  status?: string;
}
