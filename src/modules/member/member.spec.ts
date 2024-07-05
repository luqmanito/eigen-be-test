import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { QueryParams, SortOrder } from 'src/dto';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { MemberDto } from 'src/dto/member.dto';

describe('MemberController', () => {
  let controller: MemberController;
  let service: MemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
        {
          provide: MemberService,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MemberController>(MemberController);
    service = module.get<MemberService>(MemberService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('post', () => {
    it('should return the created member with meta data', async () => {
      const dto: MemberDto = {
        code: 'M00X',
        name: 'Luqman',
      };

      const expectedResult = {
        id: 1,
        ...dto,
        status: 'Active',
        last_update: null,
        created_at: new Date(),
        is_penalized: null,
      };

      const expectedResponse = {
        data: expectedResult,
        _meta: {
          code: HttpStatus.CREATED,
          status: 'success',
          message: 'success post member',
        },
      };

      jest.spyOn(service, 'post').mockResolvedValue(expectedResult);

      const result = await controller.post(dto);

      expect(result).toEqual(expectedResponse);
      expect(service.post).toHaveBeenCalledWith(dto);
    });
  });
});

describe('MemberController', () => {
  let controller: MemberController;
  let service: MemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
        {
          provide: MemberService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MemberController>(MemberController);
    service = module.get<MemberService>(MemberService);
  });

  it('should return member with metadata', async () => {
    const params: QueryParams = {
      page: 1,
      per_page: 10,
      sort: SortOrder.ASC,
      order_by: 'id',
      keyword: '',
      is_all_data: false,
      is_borrowed: false,
    };

    const total_data = 2;
    const data = [
      {
        id: 1,
        code: 'M001',
        name: 'Angga',
        status: 'Active',
        last_update: null,
        created_at: new Date(),
        is_penalized: null,
        circulation: [],
      },
      {
        id: 2,
        code: 'M002',
        name: 'Rani',
        status: 'Active',
        last_update: null,
        created_at: new Date(),
        is_penalized: null,
        circulation: [],
      },
    ];

    jest.spyOn(service, 'get').mockResolvedValue({ total_data, data });

    const result = await controller.get(params);

    expect(result).toEqual({
      data,
      metadata: {
        total_count: total_data,
        page_count: 1,
        page: params.page,
        per_page: params.per_page,
        sort: params.sort,
        order_by: params.order_by,
        keyword: params.keyword,
      },
      _meta: {
        code: HttpStatus.OK,
        status: 'success',
        message: 'success get member',
      },
    });
  });
});
