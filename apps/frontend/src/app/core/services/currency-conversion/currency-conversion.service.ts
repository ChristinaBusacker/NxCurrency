import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Currency } from '@shared/interfaces/currency.interface'
import { ApiResponse } from '@shared/models/api-response.dto'
import { HistoryService } from '../history/history.service';
@Injectable({
  providedIn: 'root'
})
export class CurrencyConversionService {

  constructor(private http: HttpClient, private historyService: HistoryService) { }

  public convertCurrency(amount: number, fromCurrency: string, targetCurrency: string): Observable<number | null> {
    return this.http.post<ApiResponse<number>>(`${environment.API_URL}/currency/convert`, {
      amount, fromCurrency, targetCurrency
    }).pipe(
      map((response) => {
        if (response.success && response.data) {
          this.historyService.setCalculationHistoryEntry(
            {
              timestamp: response.timestamp,
              inputAmount: amount,
              inputCurrency: fromCurrency,
              outputCurrency: targetCurrency,
              outputAmount: response.data
            })
          return response.data
        }

        if (response.error) {
          console.error(response.error)
        }

        return null
      })
    )
  }

  public getAvailableCurrencies(): Observable<Currency[]> {
    return this.http.get<ApiResponse<Currency[]>>(`${environment.API_URL}/currency`).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data
        }

        if (response.error) {
          console.error(response.error)
        }

        return []
      })
    )
  }
}
