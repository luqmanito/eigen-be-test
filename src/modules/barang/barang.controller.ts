import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { BarangService } from './barang.service';
import { BarangDto, KategoriDto, QueryParams, SUCCESS_STATUS } from 'src/dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('barang')
@ApiTags('Barang')
export class BarangController {
  constructor(private readonly barangService: BarangService) {}

  @Post()
  @ApiOperation({
    summary: 'Input Barang',
    description: 'Input Barang ke Unit',
  })
  async post(@Body() dto: BarangDto) {
    try {
      const data = await this.barangService.post(dto);
      return {
        data: data,
        _meta: {
          code: HttpStatus.CREATED,
          status: SUCCESS_STATUS,
          message: 'success post barang',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get Barang',
    description: 'Get barang using query params',
  })
  async get(@Query() params: QueryParams) {
    try {
      const { total_data, data } = await this.barangService.get(params);

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
          message: 'success get barang',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('kategori')
  @ApiOperation({
    summary: 'Input Kategori',
    description: 'Input kategori baru',
  })
  async postKategori(@Body() dto: KategoriDto) {
    try {
      const data = await this.barangService.postKategori(dto);
      return {
        data: data,
        _meta: {
          code: HttpStatus.CREATED,
          status: SUCCESS_STATUS,
          message: 'success post kategori',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('kategori')
  @ApiOperation({
    summary: 'Get Kategori',
    description: 'Get kategori using query params',
  })
  async getKategori(@Query() params: QueryParams) {
    try {
      const { total_data, data } = await this.barangService.getKategori(params);

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
        metadata: params.is_all_data ?  null: metadata,
        _meta: {
          code: HttpStatus.OK,
          status: SUCCESS_STATUS,
          message: 'success get kategori',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('ruangan')
  @ApiOperation({
    summary: 'Get Ruang',
    description: 'Get ruang using query params',
  })
  async getRuang(@Query() params: QueryParams) {
    try {
      const { total_data, data } = await this.barangService.getRuang(params);

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
        metadata: params.is_all_data ?  null: metadata,
        _meta: {
          code: HttpStatus.OK,
          status: SUCCESS_STATUS,
          message: 'success get ruang',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  
}
