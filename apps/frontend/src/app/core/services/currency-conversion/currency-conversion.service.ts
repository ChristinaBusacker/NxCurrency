import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyConversionService {

  public calculate(amount: number, fromCurrency: string, toCurrency: string): number {
    return amount * 2.13
  }

  public getAvailibleCurrencies(): string[] {
    return []
  }
}
