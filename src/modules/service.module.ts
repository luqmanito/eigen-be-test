import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { CirculationModule } from './circulation/circulation.module';
import { MemberModule } from './member/member.module';

@Module({
  imports: [BooksModule, MemberModule, CirculationModule, AuthModule],
})
export class ServiceModule {}
