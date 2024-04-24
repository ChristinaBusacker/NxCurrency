import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyConversionService } from './services/currency-conversion/currency-conversion.service';
import { HttpClientModule } from '@angular/common/http';
import { HistoryService } from './services/history/history.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [CurrencyConversionService, HistoryService]
})
export class CoreModule { }
