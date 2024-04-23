import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Freecurrencyapi from '@everapi/freecurrencyapi-js';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';

@Injectable()
export class CurrencyService {
    public baseUrl = this.configService.get<string>('FREECURRENCYAPI_URL')

    constructor(private configService: ConfigService, private httpService: HttpService) { }

    getAvailibleCurrencies() {


        return this.httpService.get(`${this.baseUrl}/currencies`, {
            params: {
                apikey: this.configService.get<string>('FREECURRENCYAPI_KEY')
            }
        })
            .pipe(
                map(response => response.data)
            );
    }
}
