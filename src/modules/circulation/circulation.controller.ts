import { Body, Controller, Get, HttpStatus, Patch, Post, Query } from '@nestjs/common';
import { QueryParams, SUCCESS_STATUS } from 'src/dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CirculationService } from './circulation.service';
import { CirculationDto, CirculationReturnDto } from 'src/dto/circulation.dto';

@Controller('circulation')
@ApiTags('Circulation')
export class CirculationController {
  constructor(private readonly circulationService: CirculationService) {}

  @Post()
  @ApiOperation({
    summary: 'Input Circulation',
    description: 'Input circulation',
  })
  async post(@Body() dto: CirculationDto) {
    try {
      const data = await this.circulationService.post(dto);
      return {
        data: data,
        _meta: {
          code: HttpStatus.CREATED,
          status: SUCCESS_STATUS,
          message: 'success post circulation',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch('return')
  @ApiOperation({
    summary: 'Return Circulation',
    description: 'return circulation',
  })
  async return(@Body() dto: CirculationReturnDto) {
    try {
      const data = await this.circulationService.return(dto);
      return {
        data: data,
        _meta: {
          code: HttpStatus.CREATED,
          status: SUCCESS_STATUS,
          message: 'success return circulation',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get Circulation',
    description: 'Get circulation using query params',
  })
  async get(@Query() params: QueryParams) {
    try {
      const { total_data, data } = await this.circulationService.get(params);

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
          message: 'success get circulation',
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
