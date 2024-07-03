import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BarangDto, KategoriDto, QueryParams } from 'src/dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { CustomError } from 'src/utils/customError';

@Injectable()
export class BarangService {
  constructor(private readonly prisma: PrismaService) {}

  async post(dto: BarangDto) {
    const result = await this.prisma.$transaction(
      async (trx) => {
        const data = await this.prisma.barang.create({
          data: {
            nama_barang: dto.nama_barang,
            harga_barang: dto.harga_barang,
            id_kategori: dto.id_kategori,
            tipe_barang: dto.tipe_barang,
            merk: dto.merk,
            vendor: dto.vendor,
            spesifikasi: dto.spesifikasi,
            tanggal_pengadaan: dto.tanggal_pengadaan,
            jenis_pengadaan: dto.jenis_pengadaan,
          },
        });

        return data;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
    return result;
  }

  async get(params: QueryParams) {
    const skip = params.page ? (params.page - 1) * params.per_page : 0;
    const query = [];
    if (params.kategori_id) {
      query.push({
        id_kategori: params.kategori_id,
      });
    }

    if (params.keyword) {
      query.push({
        nama_barang: {
          contains: params.keyword,
          mode: 'insensitive',
        },
      });
    }

    const [total_data, data] = await this.prisma.$transaction([
      this.prisma.barang.count({
        where: {
          AND: query,
        },
      }),
      this.prisma.barang.findMany({
        skip: params.is_all_data ? undefined : skip,
        take: params.is_all_data ? undefined : params.per_page,
        where: {
          AND: query,
        },
        include: {
          enrollment: {},
          mutasi: {},
        },
        orderBy: {
          [params.order_by]: params.sort,
        },
      }),
    ]);

    return { total_data, data };
  }

  async postKategori(dto: KategoriDto) {
    const result = await this.prisma.$transaction(
      async (trx) => {
        const data = await this.prisma.kategori.create({
          data: {
            nama_kategori: dto.nama_kategori,
            status: dto.status,
          },
        });

        return data;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
    return result;
  }

  async getKategori(params: QueryParams) {
    const skip = params.page ? (params.page - 1) * params.per_page : 0;
    const query = [];
    if (params.kategori_id) {
      query.push({
        id: params.kategori_id,
      });
    }

    if (params.keyword) {
      query.push({
        nama_kategori: {
          contains: params.keyword,
          mode: 'insensitive',
        },
      });
    }

    const [total_data, data] = await this.prisma.$transaction([
      this.prisma.kategori.count({
        where: {
          AND: query,
        },
      }),
      this.prisma.kategori.findMany({
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

  async getRuang(params: QueryParams) {
    const skip = params.page ? (params.page - 1) * params.per_page : 0;
    const query = [];
    if (params.kategori_id) {
      query.push({
        id: params.kategori_id,
      });
    }

    if (params.keyword) {
      query.push({
        nama_ruang: {
          contains: params.keyword,
          mode: 'insensitive',
        },
      });
    }

    const [total_data, data] = await this.prisma.$transaction([
      this.prisma.ruangan.count({
        where: {
          AND: query,
          id_gedung: params.gedung_id ?? undefined,
        },
      }),
      this.prisma.ruangan.findMany({
        skip: params.is_all_data ? undefined : skip,
        take: params.is_all_data ? undefined : params.per_page,
        where: {
          AND: query,
          id_gedung: params.gedung_id ?? undefined,
        },
        orderBy: {
          [params.order_by]: params.sort,
        },
      }),
    ]);

    return { total_data, data };
  }
}
