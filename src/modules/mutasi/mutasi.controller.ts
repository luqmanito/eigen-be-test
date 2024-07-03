import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { BarangDto, QueryParams, SUCCESS_STATUS } from 'src/dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MutasiService } from './mutasi.service';
import { EnrollmentDto } from 'src/dto/enrollment.dto';
import { MutasiDto } from 'src/dto/mutasi.dto';

@Controller('mutasi')
@ApiTags('Mutasi')
export class MutasiController {
  constructor(private readonly mutasiService: MutasiService) {}

  @Post()
  @ApiOperation({
    summary: 'Input Mutasi',
    description: 'Input Data Mutasi',
  })
  async post(@Body() dto: MutasiDto) {
    try {
      const data = await this.mutasiService.post(dto);
      return {
        data: data,
        _meta: {
          code: HttpStatus.CREATED,
          status: SUCCESS_STATUS,
          message: 'success post mutasi',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('unit')
  @ApiOperation({
    summary: 'Get Mutasi',
    description: 'Get mutasi using query params',
  })
  async get(@Query() params: QueryParams) {
    try {
      const { total_data, data } = await this.mutasiService.get(params);

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
        data: data,
        metadata: metadata ? metadata : null,
        _meta: {
          code: HttpStatus.OK,
          status: SUCCESS_STATUS,
          message: 'success get mutasi',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('keluar')
  @ApiOperation({
    summary: 'Get Mutasi',
    description: 'Get mutasi using query params',
  })
  async getKeluar(@Query() params: QueryParams) {
    try {
      const { total_data, data } = await this.mutasiService.getKeluar(params);

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
        data: data,
        metadata: metadata ? metadata : null,
        _meta: {
          code: HttpStatus.OK,
          status: SUCCESS_STATUS,
          message: 'success get mutasi',
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
