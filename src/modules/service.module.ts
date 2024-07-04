import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { CirculationModule } from './circulation/circulation.module';
import { MemberModule } from './member/member.module';

@Module({
  imports: [BooksModule, MemberModule, CirculationModule],
})
export class ServiceModule {}
