import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BarangDto, QueryParams, SUCCESS_STATUS } from 'src/dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentDto, UpdateEnrollmentDto } from 'src/dto/enrollment.dto';

@Controller('enrollment')
@ApiTags('Enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  @ApiOperation({
    summary: 'Input Enrollment',
    description: 'Input Enrollment ke Unit',
  })
  async post(@Body() dto: EnrollmentDto) {
    try {
      const data = await this.enrollmentService.post(dto);
      return {
        data: data,
        _meta: {
          code: HttpStatus.CREATED,
          status: SUCCESS_STATUS,
          message: 'success post enrollment',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Enrollment',
    description: 'Update enrollment using param id_barang and payloads',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateEnrollmentDto) {
    try {
      const data = await this.enrollmentService.update(Number(id), dto);
      return {
        data: data,
        _meta: {
          code: HttpStatus.CREATED,
          status: SUCCESS_STATUS,
          message: 'success update question',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get Enrollment',
    description: 'Get enrollment using query params',
  })
  async get(@Query() params: QueryParams) {
    try {
      const { total_data, data } = await this.enrollmentService.get(params);

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
          message: 'success get enrollment',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('inventaris')
  @ApiOperation({
    summary: 'Get Inventaris',
    description: 'Get Inventaris using query params',
  })
  async getInventaris(@Query() params: QueryParams) {
    try {
      const { total_data, data } =
        await this.enrollmentService.getInventaris(params);

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
        metadata: params.is_all_data ? null : metadata,
        total_data,
        _meta: {
          code: HttpStatus.OK,
          status: SUCCESS_STATUS,
          message: 'success get inventaris',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('inventaris-data')
  @ApiOperation({
    summary: 'Get Inventaris',
    description: 'Get Inventaris using query params',
  })
  async getInventarisData(@Query() params: QueryParams) {
    try {
      const { total_data, data } =
        await this.enrollmentService.getInventarisData(params);

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
        metadata: params.is_all_data ? null : metadata,
        total_data,
        _meta: {
          code: HttpStatus.OK,
          status: SUCCESS_STATUS,
          message: 'success get inventaris',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('inventaris-kategori')
  @ApiOperation({
    summary: 'Get Inventaris',
    description: 'Get Inventaris using query params',
  })
  async getInventarisKategori(@Query() params: QueryParams) {
    try {
      const { total_data, data } =
        await this.enrollmentService.getInventarisKategori(params);

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
        metadata: params.is_all_data ? null : metadata,
        total_data,
        _meta: {
          code: HttpStatus.OK,
          status: SUCCESS_STATUS,
          message: 'success get inventaris',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('inventaris-ruang')
  @ApiOperation({
    summary: 'Get Inventaris',
    description: 'Get Inventaris Ruang using query params',
  })
  async getInventarisRuang(@Query() params: QueryParams) {
    try {
      const { total_data, data } =
        await this.enrollmentService.getInventarisRuang(params);

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
        metadata: params.is_all_data ? null : metadata,
        total_data,
        _meta: {
          code: HttpStatus.OK,
          status: SUCCESS_STATUS,
          message: 'success get inventaris',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('export')
  async getRecap(@Query() params: QueryParams) {
    const { data } = await this.enrollmentService.get(params);
    return data;
  }
}
