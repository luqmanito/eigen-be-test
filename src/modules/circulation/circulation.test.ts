// // import { CirculationDto } from './dto/circulation.dto';
// import { PrismaClient } from '@prisma/client';
// // import { CustomError } from './errors';
// import moment from 'moment-timezone';
// import { CirculationDto } from 'src/dto/circulation.dto';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { BooksService } from '../books/books.service';
// // import { BooksService } from './books.service'; // Adjust the import path accordingly

// jest.mock('@prisma/client', () => {
//   const mPrismaClient = {
//     member: {
//       findUnique: jest.fn(),
//     },
//     books: {
//       findUnique: jest.fn(),
//       update: jest.fn(),
//     },
//     circulation: {
//       findMany: jest.fn(),
//       create: jest.fn(),
//     },
//     $transaction: jest.fn((fn) => fn(mPrismaClient)),
//   };
//   return { PrismaClient: jest.fn(() => mPrismaClient) };
// });

// // const prisma = new PrismaClient() as jest.Mocked<PrismaClient>;
// const prisma = new PrismaService

// const booksService = new BooksService(prisma);

// describe('BooksService', () => {
//   describe('post', () => {
//     const mockDto: CirculationDto = {
//       member_id: 1,
//       books_id: 1,
//       date: '2024-07-10T00:00:00.000Z',
//     };

//     afterEach(() => {
//       jest.clearAllMocks();
//     });

//     it('should lend a book successfully', async () => {
//       prisma.member.findUnique.mockResolvedValue({ is_penalized: null });
//       prisma.books.findUnique.mockResolvedValue({ stock: 1 });
//       prisma.circulation.findMany.mockResolvedValue([]);
//       prisma.circulation.create.mockResolvedValue({ id: 1 });
//       prisma.books.update.mockResolvedValue({});

//       const result = await booksService.post(mockDto);

//       expect(prisma.member.findUnique).toHaveBeenCalledWith({ where: { id: mockDto.member_id } });
//       expect(prisma.books.findUnique).toHaveBeenCalledWith({ where: { id: mockDto.books_id } });
//       expect(prisma.circulation.findMany).toHaveBeenCalledWith({
//         where: { member_id: mockDto.member_id, returned_at: null },
//       });
//       expect(prisma.circulation.create).toHaveBeenCalled();
//       expect(prisma.books.update).toHaveBeenCalled();
//       expect(result).toEqual({ id: 1 });
//     });

//     it('should throw an error if member is penalized and within 3 days', async () => {
//       prisma.member.findUnique.mockResolvedValue({ is_penalized: moment().subtract(1, 'days').toISOString() });

//       await expect(booksService.post(mockDto)).rejects.toThrow(CustomError);
//       await expect(booksService.post(mockDto)).rejects.toThrow(
//         'You are being penalized, please wait three days to lend a book'
//       );
//     });

//     it('should lend a book if member is penalized but penalty period is over', async () => {
//       prisma.member.findUnique.mockResolvedValue({ is_penalized: moment().subtract(4, 'days').toISOString() });
//       prisma.books.findUnique.mockResolvedValue({ stock: 1 });
//       prisma.circulation.findMany.mockResolvedValue([]);
//       prisma.circulation.create.mockResolvedValue({ id: 1 });
//       prisma.books.update.mockResolvedValue({});
//       prisma.member.update.mockResolvedValue({});

//       const result = await booksService.post(mockDto);

//       expect(prisma.member.update).toHaveBeenCalled();
//       expect(result).toEqual({ id: 1 });
//     });

//     it('should throw an error if book not found', async () => {
//       prisma.member.findUnique.mockResolvedValue({ is_penalized: null });
//       prisma.books.findUnique.mockResolvedValue(null);

//       await expect(booksService.post(mockDto)).rejects.toThrow(CustomError);
//       await expect(booksService.post(mockDto)).rejects.toThrow('Books not found');
//     });

//     it('should throw an error if book is out of stock', async () => {
//       prisma.member.findUnique.mockResolvedValue({ is_penalized: null });
//       prisma.books.findUnique.mockResolvedValue({ stock: 0 });

//       await expect(booksService.post(mockDto)).rejects.toThrow(CustomError);
//       await expect(booksService.post(mockDto)).rejects.toThrow('Books out of stock');
//     });

//     it('should throw an error if member has already borrowed 2 books', async () => {
//       prisma.member.findUnique.mockResolvedValue({ is_penalized: null });
//       prisma.books.findUnique.mockResolvedValue({ stock: 1 });
//       prisma.circulation.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);

//       await expect(booksService.post(mockDto)).rejects.toThrow(CustomError);
//       await expect(booksService.post(mockDto)).rejects.toThrow('Maximal 2 limit books reached');
//     });
//   });
// });
