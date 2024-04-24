import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { Currency } from '@shared/interfaces/currency.interface'
import { FreecurrencyapiResponse } from '@shared/interfaces/freecurrencyapiResponse.interface'
import { Observable, of } from 'rxjs';
import { CachingService } from '../../../common/caching/caching.service';


@Injectable()
export class CurrencyService {
    public baseUrl = this.configService.get<string>('FREECURRENCYAPI_URL')

    constructor(private configService: ConfigService, private httpService: HttpService, private cacheService: CachingService) { }

    public getAvailableCurrencies(): Observable<Currency[]> {
        const cached = this.cacheService.getAvailibleCurrencies();
        return cached.length > 0 ? of(cached) : this.fetchAvailableCurrencies()
    }

    private fetchAvailableCurrencies(): Observable<Currency[]> {
        console.log('FETCH')
        return this.httpService.get(`${this.baseUrl}/currencies`, {
            params: {
                apikey: this.configService.get<string>('FREECURRENCYAPI_KEY')
            }
        })
            .pipe(
                map((response: FreecurrencyapiResponse<Currency>) => {
                    const responseData = response.data.data;
                    /*
                        Here I decided to aggregate the data from the API again to only 
                        provide the data needed for the frontend. Less data means faster 
                        loading times, even if the difference here would be negligible.
                    */

                    const values = Object.keys(responseData).map((key) => {
                        const { symbol, name, decimal_digits, code } = responseData[key]
                        return { symbol, name, decimal_digits, code };
                    });

                    this.cacheService.cacheAvailibleCurrencies(values);
                    return values;
                })
            );
    }

    public convertCurrency(amount: number, fromCurrency: string, targetCurrency: string): Observable<number> {
        return this.getRate(fromCurrency, targetCurrency).pipe(
            map((rate) => rate * amount)
        )
    }

    private getRate(fromCurrency: string, targetCurrency: string): Observable<number> {
        const rate = this.cacheService.getCurrencyRate(fromCurrency, targetCurrency);
        return rate ? of(rate) : this.fetchRate(fromCurrency, targetCurrency);
    }


    private fetchRate(fromCurrency: string, targetCurrency: string): Observable<number> {
        return this.httpService.get(`${this.baseUrl}/latest`, {
            params: {
                apikey: this.configService.get<string>('FREECURRENCYAPI_KEY'),
                base_currency: fromCurrency,
                currencies: targetCurrency
            }
        }).pipe(
            map((response: FreecurrencyapiResponse<number>) => {
                const rate = response.data.data[targetCurrency];
                this.cacheService.setCurrencyRate(fromCurrency, targetCurrency, rate)
                return rate;
            })
        );
    }
}
