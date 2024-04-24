import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Currency } from '@shared/interfaces/currency.interfaces'
import { ApiResponse } from '@shared/models/api-response.dto'
@Injectable({
  providedIn: 'root'
})
export class CurrencyConversionService {

  constructor(private http: HttpClient) { }

  public convertCurrency(amount: number, fromCurrency: string, targetCurrency: string): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(`${environment.API_URL}/currency/convert`, {
      amount, fromCurrency, targetCurrency
    })
  }

  public getAvailableCurrencies(): Observable<ApiResponse<Currency[]>> {
    return this.http.get<ApiResponse<Currency[]>>(`${environment.API_URL}/currency`).pipe(
      map((data) => data)
    )
  }
}
