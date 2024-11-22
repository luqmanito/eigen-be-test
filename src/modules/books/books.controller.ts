import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksDto, QueryParams, SUCCESS_STATUS } from 'src/dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/utils/roles.guard';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';

@Controller('books')
@ApiTags('Books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  @ApiOperation({
    summary: 'Input Book',
    description: 'Input Barang ke Unit',
  })
  async post(@Body() dto: BooksDto) {
    try {
      const data = await this.booksService.post(dto);
      return {
        data: data,
        _meta: {
          code: HttpStatus.CREATED,
          status: SUCCESS_STATUS,
          message: 'success post books',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('role', ['admin', 'editor'])
  @ApiOperation({
    summary: 'Update Book',
    description: 'Update Book',
  })
  async update(@Param('id') id: string, @Body() dto: BooksDto) {
    try {
      const data = await this.booksService.update(+id, dto);
      return {
        data: data,
        _meta: {
          code: HttpStatus.OK,
          status: SUCCESS_STATUS,
          message: 'success update books',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Book',
    description: 'Delete Book',
  })
  async delete(@Param('id') id: string) {
    try {
      const data = await this.booksService.delete(+id);
      return {
        data: data,
        _meta: {
          code: HttpStatus.OK,
          status: SUCCESS_STATUS,
          message: 'success delete books',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get Books',
    description: 'Get books using query params',
  })
  async get(@Query() params: QueryParams) {
    try {
      const { total_data, data } = await this.booksService.get(params);

      const metadata = {
        total_count: total_data,
        page_count: params.is_all_data
          ? 1
          : Math.ceil(total_data / (params.per_page ?? 10)),
        page: params.is_all_data ? 1 : params.page,
        per_page: params.is_all_data ? total_data : params.per_page,
        sort: params.sort,
        order_by: params.order_by,
        keyword: params.keyword,
      };

      return {
        data,
        metadata: metadata ? metadata : null,
        _meta: {
          code: HttpStatus.OK,
          status: SUCCESS_STATUS,
          message: 'success get books',
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
