import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ApiService } from 'src/common/api/api.service';
import { QueryParams } from 'src/dto';
import { EnrollmentDto, UpdateEnrollmentDto } from 'src/dto/enrollment.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { CustomError } from 'src/utils/customError';

@Injectable()
export class EnrollmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly apiService: ApiService,
  ) {}

  async post(dto: EnrollmentDto) {
    const result = await this.prisma.$transaction(
      async (trx) => {
        const data = await this.prisma.enrollment.create({
          data: {
            id_barang: dto.id_barang,
            id_cabang: dto.id_cabang,
            id_gedung: dto.id_gedung,
            id_ruang: `${dto.id_ruang}`,
            kondisi: dto.kondisi,
            nik_pengguna: dto.nik_pengguna,
            jenis_pengguna: dto.jenis_pengguna,
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

  async get(params: QueryParams) {
    const skip = params.page ? (params.page - 1) * params.per_page : 0;
    const query: any = {};
    console.log(params);

    if (params.cabang_id) {
      query.id_cabang = params.cabang_id;
    }

    if (params.gedung_ids) {
      const list_id_gedung = params.gedung_ids.split(',').map(Number);
      query.id_gedung = {
        in: list_id_gedung,
      };
    }

    if (params.tgl_awal && params.tgl_akhir) {
      query.tanggal_input = {
        lte: params.tgl_akhir,
        gte: params.tgl_awal,
      };
    }

    const [total_data, data] = await this.prisma.$transaction([
      this.prisma.enrollment.count({
        where: {
          AND: query,
        },
      }),
      this.prisma.enrollment.findMany({
        skip: params.is_all_data ? undefined : skip,
        take: params.is_all_data ? undefined : params.per_page,
        where: {
          AND: query,
        },
        orderBy: {
          [params.order_by]: params.sort,
        },
        include: {
          barang: {
            include: {
              kategori: {},
              mutasi: {},
            },
          },
        },
      }),
    ]);

    const dataRuang = await this.prisma.ruangan.findMany({
      where: {
        id: {
          in: data.map((item) => item.id_ruang),
        },
      },
    });

    const addRuangData = data.map((item) => {
      const find = dataRuang.find((ruang) => ruang.id === item.id_ruang);
      return {
        ...item,
        nama_ruang: find ? find?.nama_ruang : null,
      };
    });

    function processMutasiData(data) {
      data.forEach((entry) => {
        if (entry.barang && entry.barang.mutasi) {
          entry.barang.mutasi = entry.barang.mutasi.filter(
            (mutasi) => mutasi.id_gedung_tujuan === entry.id_gedung,
          );
        }
      });
      return data;
    }

    const processedData = processMutasiData(addRuangData);

    // Get gedung data
    const arrGedungId = processedData.map((item) => item.id_gedung);
    const urlGedung = `${process.env.SVC_DB_GO}/api/v1/gedung/all/?ids=${arrGedungId.join(',')}`;
    const respGedung = await this.apiService.get(urlGedung);
    const dataGedung = respGedung?.data ?? [];

    processedData.forEach((list) => {
      const gedung = dataGedung.find((item) => item.id === list.id_gedung);
      list['nama_gedung'] = gedung?.name ?? null;
    });

    // Get user data
    const arrUserNik = processedData
      .filter((user) => user.nik_pengguna !== null)
      .map((item) => String(item.nik_pengguna));
    const urlUser = `${process.env.SVC_DB_GO}/api/v1/karyawan/listNik/?nik=${arrUserNik.join(',')}`;
    const respUser = await this.apiService.get(urlUser);
    const dataUser = respUser?.data ?? [];

    processedData.forEach((list) => {
      const pengguna = dataUser.find(
        (item) => item.c_nik === list.nik_pengguna,
      );
      list['nama_pengguna'] = pengguna?.c_nama_lengkap ?? null;
      list['jabatan'] = pengguna?.t_jabatan_posisi?.c_jabatan_posisi ?? null;
    });

    return { total_data, data: processedData };
  }

  async getInventaris(params: QueryParams) {
    const query = [];
    const skip = params.page ? (params.page - 1) * params.per_page : 0;
    if (params.tgl_awal && params.tgl_akhir) {
      query.push({
        tanggal_input: {
          lte: params.tgl_akhir,
          gte: params.tgl_awal,
        },
      });
    }

    const [total_data, data] = await this.prisma.$transaction([
      this.prisma.enrollment.count({
        where: {
          AND: query,
          id_cabang: params.cabang_id ?? undefined,
          id_gedung: params.gedung_id ?? undefined,
        },
      }),
      this.prisma.enrollment.findMany({
        skip: params.is_all_data ? undefined : skip,
        take: params.is_all_data ? undefined : params.per_page,
        where: {
          AND: query,
          id_cabang: params.cabang_id ?? undefined,
          id_gedung: params.gedung_id ?? undefined,
        },
        orderBy: {
          [params.order_by]: params.sort,
        },
        include: {
          barang: {},
        },
      }),
    ]);

    const calc = data.map((item) => {
      return {
        nama_barang: item.barang.nama_barang,
        kondisi: item.kondisi,
        merk: item.barang.merk,
      };
    });

    function calculateConditions(data) {
      const conditionCounts = {};

      data.forEach((entry) => {
        const { nama_barang, kondisi, merk } = entry;
        if (!conditionCounts[nama_barang]) {
          conditionCounts[nama_barang] = { merk, bagus: 0, rusak: 0 };
        }
        if (kondisi === 'bagus') {
          conditionCounts[nama_barang].bagus += 1;
        } else if (kondisi === 'rusak') {
          conditionCounts[nama_barang].rusak += 1;
        }
      });

      return Object.keys(conditionCounts).map((nama_barang) => ({
        nama_barang,
        merk: conditionCounts[nama_barang].merk,
        bagus: conditionCounts[nama_barang].bagus,
        rusak: conditionCounts[nama_barang].rusak,
        total:
          conditionCounts[nama_barang].bagus +
          conditionCounts[nama_barang].rusak,
      }));
    }

    const result = calculateConditions(calc);

    return { total_data, data: result };
  }
  async getInventarisData(params: QueryParams) {
    const query = [];
    const skip = params.page ? (params.page - 1) * params.per_page : 0;
    if (params.tgl_awal && params.tgl_akhir) {
      query.push({
        tanggal_input: {
          lte: params.tgl_akhir,
          gte: params.tgl_awal,
        },
      });
    }

    const [total_data, data] = await this.prisma.$transaction([
      this.prisma.enrollment.count({
        where: {
          AND: query,
          id_cabang: params.cabang_id,
          id_gedung: params.gedung_id,
          id_ruang: params.ruang_id ?? undefined,
          barang: {
            nama_barang: {
              contains: params.keyword,
              mode: 'insensitive',
            },
            id_kategori: params?.kategori_id,
          },
        },
      }),
      this.prisma.enrollment.findMany({
        skip: params.is_all_data ? undefined : skip,
        take: params.is_all_data ? undefined : params.per_page,
        where: {
          AND: query,
          id_cabang: params.cabang_id,
          id_gedung: params.gedung_id,
          id_ruang: params.ruang_id ?? undefined,
          barang: {
            nama_barang: {
              contains: params.keyword,
              mode: 'insensitive',
            },
            id_kategori: params?.kategori_id,
          },
        },
        orderBy: {
          [params.order_by]: params.sort,
        },
        include: {
          barang: true,
        },
      }),
    ]);

    const result = data.map((item) => {
      return {
        id_brg: item.id_barang,
        nama_brg: item.barang.nama_barang,
        type: item?.barang?.tipe_barang,
        spek: item.barang.spesifikasi,
        kategori: item?.barang?.id_kategori,
        merk: item.barang.merk,
        bagus: item?.kondisi === 'bagus' ? 1 : 0,
        rusak: item?.kondisi === 'rusak' ? 1 : 0,
        total: 1,
      };
    });

    return { total_data, data: result };
  }

  async getInventarisKategori(params: QueryParams) {
    const skip = params.page ? (params.page - 1) * params.per_page : 0;
    const query = [];

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

    const dataInventory = await Promise.all(
      data.map(async (item) => {
        const penilai = await this.prisma.enrollment.findMany({
          where: {
            id_cabang: params.cabang_id,
            id_gedung: params.gedung_id,
            id_ruang: params.ruang_id ?? undefined,
            barang: {
              id_kategori: item?.id,
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
        return penilai;
      }),
    );

    const counts = data.reduce((acc, category) => {
      acc[category.nama_kategori] = {
        id_kategori: category.id,
        rusak: 0,
        bagus: 0,
      };
      return acc;
    }, {});

    dataInventory.forEach((enrollmentList) => {
      enrollmentList.forEach((enrollment) => {
        const category = enrollment.barang.kategori.nama_kategori;
        const kondisi = enrollment.kondisi.toLowerCase();
        if (counts[category]) {
          counts[category][kondisi]++;
        }
      });
    });

    const dataArr = [];

    for (const type in counts) {
      const rusak = counts[type].rusak;
      const bagus = counts[type].bagus;
      const id_kategori = counts[type].id_kategori;

      const itemObj = {
        id_kategori,
        type,
        rusak,
        bagus,
        total: rusak + bagus,
      };

      dataArr.push(itemObj);
    }

    return { total_data, data: dataArr };
  }

  async getInventarisRuang(params: QueryParams) {
    const skip = params.page ? (params.page - 1) * params.per_page : 0;
    const query = [];

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

    const dataInventory = await Promise.all(
      data.map(async (item) => {
        const penilai = await this.prisma.enrollment.findMany({
          where: {
            id_cabang: params.cabang_id,
            id_gedung: params.gedung_id,
            id_ruang: params.ruang_id ?? undefined,
            barang: {
              id_kategori: item?.id,
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
        return penilai;
      }),
    );

    const counts = data.reduce((acc, category) => {
      acc[category.nama_kategori] = {
        id_kategori: category.id,
        rusak: 0,
        bagus: 0,
      };
      return acc;
    }, {});

    dataInventory.forEach((enrollmentList) => {
      enrollmentList.forEach((enrollment) => {
        const category = enrollment.barang.kategori.nama_kategori;
        const kondisi = enrollment.kondisi.toLowerCase();
        if (counts[category]) {
          counts[category][kondisi]++;
        }
      });
    });

    const dataArr = [];

    for (const type in counts) {
      const rusak = counts[type].rusak;
      const bagus = counts[type].bagus;
      const id_kategori = counts[type].id_kategori;

      const itemObj = {
        id_kategori,
        type,
        rusak,
        bagus,
        total: rusak + bagus,
      };

      dataArr.push(itemObj);
    }

    return { total_data, data: dataArr };
  }

  async update(id: number, dto: UpdateEnrollmentDto) {
    const update = await this.prisma.enrollment.update({
      where: {
        id: id,
      },
      data: {
        id_ruang: `${dto.id_ruang}`,
        nik_pengguna: dto.nik_pengguna,
        jenis_pengguna: dto.jenis_pengguna,
        tanggal_input: dto.tanggal_input,
        kondisi: dto.kondisi,
      },
    });

    return update;
  }
}
