import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CirculationDto {
  @ApiProperty({ required: true, example: 1, description: 'Input books id' })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  books_id: number;

  @ApiProperty({ required: true, example: 1, description: 'Input member id' })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  member_id: number;

  @ApiProperty({
    required: false,
    example: '01-05-2024',
    description: 'Input borrowing date',
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  date: string;
}

export class CirculationReturnDto {
  @ApiProperty({
    required: true,
    example: 2,
    description: 'Input circulation_id ',
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  circulation_id: number;

  @ApiProperty({
    required: true,
    example: '2024-07-08T00:00:00.000Z',
    description: 'Input returned date',
  })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  returned_at: string;

  @ApiProperty({
    required: true,
    example: 1,
    description: 'Input member id',
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  member_id: number;

  @ApiProperty({ required: true, example: 17, description: 'Input books id' })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  books_id: number;
}
