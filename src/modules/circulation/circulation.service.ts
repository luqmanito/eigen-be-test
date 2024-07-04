import { Injectable } from '@nestjs/common';
import { QueryParams } from 'src/dto';
import { CirculationDto, CirculationReturnDto } from 'src/dto/circulation.dto';
import { CustomError } from 'src/utils/customError';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CirculationService {
  constructor(private readonly prisma: PrismaService) {}

  async post(dto: CirculationDto) {
    const moment = require('moment-timezone');
    const result = await this.prisma.$transaction(async (prisma) => {
      const member = await prisma.member.findUnique({
        where: {
          id: dto.member_id,
        },
      });

      let differenceInDays;
      if (dto.date) {
        const date1 = moment(dto.date);
        const date2 = moment(member.is_penalized);
        differenceInDays = date1.diff(date2, 'days');
      }

      if (member.is_penalized) {
        if (differenceInDays && differenceInDays > 3) {
          const item = await prisma.books.findUnique({
            where: {
              id: dto.books_id,
            },
          });

          if (!item) {
            throw new CustomError(`Books not found`, 404);
          }

          if (item?.stock <= 0) {
            throw new CustomError(`Insufficient quantity`, 400);
          }

          const check = await prisma.circulation.findMany({
            where: {
              member_id: dto.member_id,
              returned_at: null,
            },
          });

          if (check.length >= 2) {
            throw new CustomError(`Maximal 2 limit books reached`, 400);
          }

          const dateCreated = moment(dto.date);
          const lend = await prisma.circulation.create({
            data: {
              books_id: dto.books_id,
              member_id: dto.member_id,
              created_at: dateCreated,
            },
          });

          const update = await prisma.books.update({
            where: {
              id: dto.books_id,
            },
            data: {
              stock: {
                decrement: 1,
              },
            },
          });

          const updateMember = await prisma.member.update({
            where: {
              id: dto.member_id,
            },
            data: {
              is_penalized: null,
            },
          });
          return lend;
        }
        throw new CustomError(
          `You are being penalized, please wait three days to lend a book`,
          403,
        );
      }

      const item = await prisma.books.findUnique({
        where: {
          id: dto.books_id,
        },
      });

      if (!item) {
        throw new CustomError(`Books not found`, 404);
      }

      if (item?.stock <= 0) {
        throw new CustomError(`Insufficient quantity`, 400);
      }

      const check = await prisma.circulation.findMany({
        where: {
          member_id: dto.member_id,
          returned_at: null,
        },
      });

      if (check.length >= 2) {
        throw new CustomError(`Maximal 2 limit books reached`, 400);
      }

      const dateCreated = moment(dto.date);
      const lend = await prisma.circulation.create({
        data: {
          books_id: dto.books_id,
          member_id: dto.member_id,
          created_at: dateCreated,
        },
      });

      const update = await prisma.books.update({
        where: {
          id: dto.books_id,
        },
        data: {
          stock: {
            decrement: 1,
          },
        },
      });
      return lend;
    });
    return result;
  }

  async return(dto: CirculationReturnDto) {
    const moment = require('moment-timezone');
    const result = await this.prisma.$transaction(async (prisma) => {
      const circulation = await prisma.circulation.findUnique({
        where: {
          id: dto.circulation_id,
        },
      });

      const dateCreated = moment(circulation.created_at)
        .tz('Asia/Jakarta')
        .startOf('day');
      const dateReturned = moment(dto.returned_at);

      const differenceInDays = dateReturned.diff(dateCreated, 'days');
      if (differenceInDays > 7) {
        await prisma.member.update({
          where: {
            id: dto.member_id,
          },
          data: {
            is_penalized: new Date(),
          },
        });
      }

      const fillDateReturn = await prisma.circulation.update({
        where: {
          id: dto.circulation_id,
        },
        data: {
          returned_at: moment(dto.returned_at),
        },
      });

      if (fillDateReturn.books_id !== dto.books_id) {
        throw new CustomError(`Please return a correct book`, 400);
      }

      const returnBook = await prisma.books.update({
        where: {
          id: dto.books_id,
        },
        data: {
          stock: {
            increment: 1,
          },
        },
      });

      return fillDateReturn;
    });
    return result;
  }

  async get(params: QueryParams) {
    const skip = params.page ? (params.page - 1) * params.per_page : 0;
    const query = [];

    if (params.keyword) {
      query.push({
        title: {
          contains: params.keyword,
          mode: 'insensitive',
        },
      });
    }

    const [total_data, data] = await this.prisma.$transaction([
      this.prisma.circulation.count({
        where: {
          AND: query,
        },
      }),
      this.prisma.circulation.findMany({
        skip: params.is_all_data ? undefined : skip,
        take: params.is_all_data ? undefined : params.per_page,
        where: {
          AND: query,
        },
        orderBy: {
          [params.order_by]: params.sort,
        },
      }),
    ]);

    return { total_data, data };
  }
}
