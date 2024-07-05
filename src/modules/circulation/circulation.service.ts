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

    const getMember = async (prisma) => {
      return await prisma.member.findUnique({
        where: { id: dto.member_id },
      });
    };

    const getBook = async (prisma) => {
      const book = await prisma.books.findUnique({
        where: { id: dto.books_id },
      });
      if (!book) throw new CustomError('Books not found', 404);
      if (book.stock <= 0) throw new CustomError('Books out of stock', 400);
      return book;
    };

    const checkMemberCirculation = async (prisma) => {
      const circulations = await prisma.circulation.findMany({
        where: {
          member_id: dto.member_id,
          returned_at: null,
        },
      });
      if (circulations.length >= 2)
        throw new CustomError('Maximal 2 limit books reached', 400);
    };

    const createCirculationRecord = async (prisma) => {
      const dateCreated = moment(dto.date);
      const lend = await prisma.circulation.create({
        data: {
          books_id: dto.books_id,
          member_id: dto.member_id,
          created_at: dateCreated,
        },
      });

      await prisma.books.update({
        where: { id: dto.books_id },
        data: { stock: { decrement: 1 } },
      });

      return lend;
    };

    const handlePenalizedMember = async (prisma, member) => {
      const date1 = moment(dto.date);
      const date2 = moment(member.is_penalized);
      const differenceInDays = date1.diff(date2, 'days');

      if (differenceInDays > 3) {
        await checkMemberCirculation(prisma);
        const lend = await createCirculationRecord(prisma);

        await prisma.member.update({
          where: { id: dto.member_id },
          data: { is_penalized: null },
        });

        return lend;
      }

      throw new CustomError(
        'You are being penalized, please wait three days to lend a book',
        403,
      );
    };

    return await this.prisma.$transaction(async (prisma) => {
      const member = await getMember(prisma);

      if (member.is_penalized) {
        return await handlePenalizedMember(prisma, member);
      }

      await getBook(prisma);
      await checkMemberCirculation(prisma);

      return await createCirculationRecord(prisma);
    });
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
