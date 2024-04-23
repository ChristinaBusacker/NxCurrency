import { Module } from '@nestjs/common';
import { CurrencyController } from './controllers/currency.controller';
import { CurrencyService } from './services/currency.service';
import { HttpModule } from '@nestjs/axios';
import { CachingModule } from '../../common/caching/caching.module';

@Module({
  imports: [HttpModule, CachingModule],
  controllers: [CurrencyController],
  providers: [CurrencyService],
})
export class CurrencyModule { }
