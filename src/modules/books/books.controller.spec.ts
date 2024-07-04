// import { Test, TestingModule } from '@nestjs/testing';
// import { HttpStatus } from '@nestjs/common';
// import { BarangController } from './books.controller';
// import { BarangService } from './books.service';
// import { BarangDto } from 'src/dto';


// describe('BarangController', () => {
//   let controller: BarangController;
//   let service: BarangService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [BarangController],
//       providers: [
//         {
//           provide: BarangService,
//           useValue: {
//             post: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     controller = module.get<BarangController>(BarangController);
//     service = module.get<BarangService>(BarangService);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   describe('post', () => {
//     it('should return the created barang with meta data', async () => {
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
//         id: 1,
//         status : 'Aktif',
//         ...dto,
//       };

//       const expectedResponse = {
//         data: expectedResult,
//         _meta: {
//           code: HttpStatus.CREATED,
//           status: 'success',
//           message: 'success post barang',
//         },
//       };

//       jest.spyOn(service, 'post').mockResolvedValue(expectedResult);

//       const result = await controller.post(dto);

//       expect(result).toEqual(expectedResponse);
//       expect(service.post).toHaveBeenCalledWith(dto);
//     });
//   });
// });
