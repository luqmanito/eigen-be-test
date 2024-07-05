import { Injectable } from '@nestjs/common';
import { BooksDto, QueryParams } from 'src/dto';
import { MemberDto } from 'src/dto/member.dto';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}

  async post(dto: MemberDto) {
    const result = await this.prisma.$transaction(async (prisma) => {
      const data = await prisma.member.create({
        data: {
          name: dto.name,
          code: dto.code,
        },
      });
      return data;
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

    interface IncludeObject {
      circulation?: object;
    }

    const includeObject: IncludeObject = {};

    if (params.is_borrowed) {
      includeObject.circulation = {
        include: {
          books: {},
        },
      };
    }

    const [total_data, data] = await this.prisma.$transaction([
      this.prisma.member.count({
        where: {
          AND: query,
        },
      }),
      this.prisma.member.findMany({
        skip: params.is_all_data ? undefined : skip,
        take: params.is_all_data ? undefined : params.per_page,
        where: {
          AND: query,
        },
        include: includeObject,
        orderBy: {
          [params.order_by]: params.sort,
        },
      }),
    ]);

    return { total_data, data };
  }
}
