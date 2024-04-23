import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { CurrencyService } from '../services/currency.service';
import { catchError, map, of } from 'rxjs';
import { ApiResponse } from '@shared/models/api-response.dto';

/*
 * I am aware that there can be arguments about whether two different controllers 
 * should have been used for the currencies and the conversion. For now I found it 
 * easier to choose a controller, especially since the data comes from the same endpoint.
*/
@Controller('currency')
export class CurrencyController {
    constructor(private currencyService: CurrencyService) { }

    @Get()
    getAvailableCurrencies() {
        return this.currencyService.getAvailableCurrencies().pipe(
            map((currencies) => {
                return currencies.length > 0 ? ApiResponse.success(currencies) : ApiResponse.fail('No currencies found')
            }),
            catchError(() => of(ApiResponse.fail('Failed to get currencies')))
        )
    }
    @Post('convert')
    convertCurrency(
        @Body() body: { amount: number; fromCurrency: string; toCurrency: string }
    ) {
        if (!body.amount || !body.fromCurrency || !body.toCurrency) {
            return of(ApiResponse.fail('Missing required fields: amount, fromCurrency, or toCurrency.'))
        }

        return this.currencyService.convertCurrency(body.amount, body.fromCurrency, body.toCurrency).pipe(
            map((result) => ApiResponse.success(result)),
            catchError(() => of(ApiResponse.fail('Failed to convert currency')))
        );
    }
}
