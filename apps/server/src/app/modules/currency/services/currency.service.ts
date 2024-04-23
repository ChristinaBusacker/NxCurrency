import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { FreecurrencyapiResponse } from '@shared/interfaces/currency.interfaces'

@Injectable()
export class CurrencyService {
    public baseUrl = this.configService.get<string>('FREECURRENCYAPI_URL')

    constructor(private configService: ConfigService, private httpService: HttpService) { }

    getAvailableCurrencies() {
        return this.httpService.get(`${this.baseUrl}/currencies`, {
            params: {
                apikey: this.configService.get<string>('FREECURRENCYAPI_KEY')
            }
        })
            .pipe(
                map((response: FreecurrencyapiResponse) => {
                    const responseData = response.data.data;

                    /*
                        Here I decided to aggregate the data from the API again to only 
                        provide the data needed for the frontend. Less data means faster 
                        loading times, even if the difference here would be negligible.
                    */

                    return Object.keys(responseData).map((key) => {
                        const { symbol, name, decimal_digits, code } = responseData[key]
                        return { symbol, name, decimal_digits, code };
                    })
                })
            );
    }
}
