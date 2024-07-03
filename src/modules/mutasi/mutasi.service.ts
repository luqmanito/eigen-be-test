import { HttpStatus, Injectable, Param } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { QueryParams } from 'src/dto';
import { MutasiDto } from 'src/dto/mutasi.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { CustomError } from 'src/utils/customError';
import { ApiService } from 'src/common/api/api.service';

@Injectable()
export class MutasiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly apiService: ApiService,
  ) {}

  async post(dto: MutasiDto) {
    const result = await this.prisma.$transaction(
      async (trx) => {
        const data = await this.prisma.mutasi.create({
          data: {
            id_gedung_asal: dto.id_gedung_asal,
            id_gedung_tujuan: dto.id_gedung_tujuan,
            id_cabang_asal: dto.id_cabang_asal,
            id_cabang_tujuan: dto.id_cabang_tujuan,
            id_barang: dto.id_barang,
            id_dokumen: dto.id_dokumen,
            type: dto.type,
            tanggal_mutasi: dto.tanggal_mutasi,
            keterangan: dto.keterangan,
            is_selesai_mutasi: dto.is_selesai_mutasi,
          },
        });

        if (dto.type === 'MUTASI') {
          const dataEnrollment = await this.prisma.enrollment.create({
            data: {
              id_barang: dto.id_barang,
              id_cabang: dto.id_cabang_tujuan,
              id_gedung: dto.id_gedung_tujuan,
            },
          });
        }

        return { data };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
    return result;
  }

  async get(params: QueryParams) {
    const skip = params.page ? (params.page - 1) * params.per_page : 0;
    const query: any = {};

    if (params.cabang_id) {
      query.id_cabang_asal = params.cabang_id;
    }

    if (params.gedung_ids) {
      const list_id_gedung = params.gedung_ids.split(',').map(Number);
      query.id_gedung_tujuan = {
        in: list_id_gedung,
      };
    }

    if (params.tgl_awal && params.tgl_akhir) {
      query.tanggal_mutasi = {
        lte: params.tgl_akhir,
        gte: params.tgl_awal,
      };
    }

    const [total_data, data] = await this.prisma.$transaction([
      this.prisma.mutasi.count({
        where: {
          AND: query,
          type: 'MUTASI',
        },
      }),
      this.prisma.mutasi.findMany({
        skip: params.is_all_data ? undefined : skip,
        take: params.is_all_data ? undefined : params.per_page,
        where: {
          AND: query,
          type: 'MUTASI',
        },
        orderBy: {
          [params.order_by]: params.sort,
        },
      }),
    ]);

    const dataBarang = await this.prisma.enrollment.findMany({
      where: {
        id_barang: {
          in: data.map((item) => item.id_barang),
        },
        id_gedung: {
          in: data.map((item) => item.id_gedung_tujuan),
        },
      },
      include: {
        barang: {
          include: {
            kategori: {},
          },
        },
      },
    });

    const dataRuang = await this.prisma.ruangan.findMany({
      where: {
        id: {
          in: dataBarang.map((item) => item.id_ruang),
        },
      },
    });

    const addRuangData = dataBarang.map((item) => {
      const find = dataRuang.find((ruang) => ruang.id === item.id_ruang);
      return {
        ...item,
        nama_ruang: find ? find?.nama_ruang : null,
      };
    });

    // Get user data
    const arrUserNik = addRuangData
      .filter((user) => user.nik_pengguna !== null)
      .map((item) => String(item.nik_pengguna));
    const urlUser = `${process.env.SVC_DB_GO}/api/v1/karyawan/listNik/?nik=${arrUserNik.join(',')}`;
    const respUser = await this.apiService.get(urlUser);
    const dataUser = respUser?.data ?? [];

    // Get gedung data
    const arrGedungId = data.map((item) => item.id_gedung_asal);
    const arrGedungTujuanId = data.map((item) => item.id_gedung_tujuan);
    const combinedArray = arrGedungId.concat(arrGedungTujuanId);
    const urlGedung = `${process.env.SVC_DB_GO}/api/v1/gedung/all/?ids=${combinedArray.join(',')}`;
    const respGedung = await this.apiService.get(urlGedung);
    const dataGedung = respGedung?.data ?? [];

    addRuangData.forEach((list) => {
      const pengguna = dataUser.find(
        (item) => item.c_nik === list.nik_pengguna,
      );

      list['nama_pengguna'] = pengguna?.c_nama_lengkap ?? null;
      list['jabatan'] = pengguna?.t_jabatan_posisi?.c_jabatan_posisi ?? null;
    });

    data.forEach((list) => {
      const gedung = dataGedung.find((item) => item.id === list.id_gedung_asal);
      const gedungTujuan = dataGedung.find(
        (item) => item.id === list.id_gedung_tujuan,
      );
      list['gedung_asal'] = gedung?.name ?? null;
      list['gedung_tujuan'] = gedungTujuan?.name ?? null;
    });

    const combinedData = data.map((list) => {
      const barang = addRuangData.find(
        (item) => item.id_barang === list.id_barang,
      );
      return {
        ...list,
        ...barang,
      };
    });

    return { total_data, data: combinedData };
  }
  async getKeluar(params: QueryParams) {
    const skip = params.page ? (params.page - 1) * params.per_page : 0;
    const query: any = {};

    if (params.cabang_id) {
      query.id_cabang_asal = params.cabang_id;
    }

    if (params.gedung_ids) {
      const list_id_gedung = params.gedung_ids.split(',').map(Number);
      query.id_gedung_tujuan = {
        in: list_id_gedung,
      };
    }

    if (params.tgl_awal && params.tgl_akhir) {
      query.tanggal_mutasi = {
        lte: params.tgl_akhir,
        gte: params.tgl_awal,
      };
    }

    const [total_data, data] = await this.prisma.$transaction([
      this.prisma.mutasi.count({
        where: {
          AND: query,
          type: params.type ?? undefined,
        },
      }),
      this.prisma.mutasi.findMany({
        skip: params.is_all_data ? undefined : skip,
        take: params.is_all_data ? undefined : params.per_page,
        where: {
          AND: query,
          type: params.type ?? undefined,
        },
        orderBy: {
          [params.order_by]: params.sort,
        },
      }),
    ]);

    const dataBarang = await this.prisma.enrollment.findMany({
      where: {
        id_barang: {
          in: data.map((item) => item.id_barang),
        },
        id_gedung: {
          in: data.map((item) => item.id_gedung_tujuan),
        },
      },
      include: {
        barang: {
          include: {
            kategori: {},
          },
        },
      },
    });

    if (dataBarang.length === 0) {
      throw new CustomError(`Data Tidak ditemukan`, 404);
    }

    const dataRuang = await this.prisma.ruangan.findMany({
      where: {
        id: {
          in: dataBarang.map((item) => item.id_ruang),
        },
      },
    });

    const addRuangData = dataBarang.map((item) => {
      const find = dataRuang.find((ruang) => ruang.id === item.id_ruang);
      return {
        ...item,
        nama_ruang: find ? find?.nama_ruang : null,
      };
    });

    // Get user data
    const arrUserNik = addRuangData
      .filter((user) => user.nik_pengguna !== null)
      .map((item) => String(item.nik_pengguna));
    const urlUser = `${process.env.SVC_DB_GO}/api/v1/karyawan/listNik/?nik=${arrUserNik.join(',')}`;
    const respUser = await this.apiService.get(urlUser);
    const dataUser = respUser?.data ?? [];

    // Get gedung data
    const arrGedungId = data.map((item) => item.id_gedung_asal);
    const arrGedungTujuanId = data.map((item) => item.id_gedung_tujuan);
    const combinedArray = arrGedungId.concat(arrGedungTujuanId);
    const urlGedung = `${process.env.SVC_DB_GO}/api/v1/gedung/all/?ids=${combinedArray.join(',')}`;
    const respGedung = await this.apiService.get(urlGedung);
    const dataGedung = respGedung?.data ?? [];

    addRuangData.forEach((list) => {
      const pengguna = dataUser.find(
        (item) => item.c_nik === list.nik_pengguna,
      );

      list['nama_pengguna'] = pengguna ? pengguna?.c_nama_lengkap : null;
      list['jabatan'] = pengguna
        ? pengguna?.t_jabatan_posisi?.c_jabatan_posisi
        : null;
    });

    data.forEach((list) => {
      const gedung = dataGedung.find((item) => item.id === list.id_gedung_asal);
      const gedungTujuan = dataGedung.find(
        (item) => item.id === list.id_gedung_tujuan,
      );
      list['gedung_asal'] = gedung ? gedung?.name : null;
      list['gedung_tujuan'] = gedungTujuan ? gedungTujuan?.name : null;
    });
    const filteredAddRuangData = addRuangData.filter((item) => item.barang);

    const combinedData = data
      .filter((item, index) => filteredAddRuangData[index])
      .map((item, index) => {
        const ruanganData = filteredAddRuangData[index];
        return {
          ...item,
          ...ruanganData,
          barang: {
            ...ruanganData.barang,
          },
        };
      });

    return { total_data, data: combinedData };
  }
}
