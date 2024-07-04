import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BooksDto, QueryParams, SortOrder } from 'src/dto';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('post', () => {
    it('should return the created books with meta data', async () => {
      const dto: BooksDto = {
        code: 'Type-01',
        stock: 1,
        title: 'Majalah Bobo',
        author: 'Luqman',
      };

      const expectedResult = {
        id: 1,
        ...dto,
        status: 'Active',
        last_update: null,
        created_at: new Date(),
      };

      const expectedResponse = {
        data: expectedResult,
        _meta: {
          code: HttpStatus.CREATED,
          status: 'success',
          message: 'success post books',
        },
      };

      jest.spyOn(service, 'post').mockResolvedValue(expectedResult);

      const result = await controller.post(dto);

      expect(result).toEqual(expectedResponse);
      expect(service.post).toHaveBeenCalledWith(dto);
    });
  });
});

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should return books with metadata', async () => {
    const params: QueryParams = {
      page: 1,
      per_page: 10,
      sort: SortOrder.ASC,
      order_by: 'id',
      keyword: '',
      is_all_data: false,
      is_borrowed: false,
    };

    const total_data = 6;
    const data = [
      {
        id: 15,
        code: 'JK-45',
        stock: 4,
        title: 'Harry Potter',
        author: 'J.K Rowling',
        status: 'Active',
        last_update: null,
        created_at: new Date(),
        circulation : []
      },
      {
        id: 16,
        code: 'SHR-1',
        stock: 43,
        title: 'A Study in Scarlet',
        author: 'Arthur Conan Doyle',
        status: 'Active',
        last_update: null,
        created_at: new Date(),
        circulation : []
      },
      {
        id: 17,
        code: 'TW-11',
        stock: 3,
        title: 'Twilight',
        author: 'Stephenie Meyer',
        status: 'Active',
        last_update: null,
        created_at: new Date(),
        circulation : []
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
        message: 'success get books',
      },
    });
  });
});
