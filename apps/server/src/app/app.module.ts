import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { CurrencyModule } from './modules/currency/currency.module';
import { ConfigModule } from '@nestjs/config';
import { CachingModule } from './common/caching/caching.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CurrencyModule,
  ],
  controllers: [AppController],
  providers: [],
}) //
export class AppModule { }
