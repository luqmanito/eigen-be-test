// import { Test, TestingModule } from '@nestjs/testing';
// import { BarangDto } from 'src/dto';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { BarangService } from './books.service';

// describe('BarangService', () => {
//   let barangService: BarangService;
//   let prismaService: PrismaService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [BarangService, PrismaService],
//     }).compile();

//     barangService = module.get<BarangService>(BarangService);
//     prismaService = module.get<PrismaService>(PrismaService);
//   });

//   it('should be defined', () => {
//     expect(barangService).toBeDefined();
//   });

//   describe('post', () => {
//     it('should create a barang', async () => {
//       const dto: BarangDto = {
//         nama_barang: 'Test Barang',
//         harga_barang: 1000,
//         id_kategori: 1,
//         tipe_barang: 'Type',
//         merk: 'Merk',
//         vendor: 'Vendor',
//         spesifikasi: 'Specs',
//         tanggal_pengadaan: new Date(),
//         jenis_pengadaan: 'MUTASI',
//       };

//       const expectedResult = {
//         ...dto,
//         id: 1,
//       };

//       prismaService.barang.create = jest.fn().mockResolvedValue(expectedResult);

//       const result = await barangService.post(dto);

//       expect(result).toEqual(expectedResult);
//       expect(prismaService.barang.create).toHaveBeenCalledWith({
//         data: dto,
//       });
//     });
//   });
// });
