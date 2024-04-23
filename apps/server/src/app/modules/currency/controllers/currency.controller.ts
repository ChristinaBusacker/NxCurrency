import { Controller, Get } from '@nestjs/common';
import { CurrencyService } from '../services/currency.service';
import { catchError, map, of } from 'rxjs';
import { ApiResponse } from '@shared/models/api-response.dto';

@Controller('currency')
export class CurrencyController {
    constructor(private currencyService: CurrencyService) { }

    @Get()
    getData() {
        return this.currencyService.getAvailableCurrencies().pipe(
            map((currencies) => ApiResponse.success(currencies)),
            catchError(() => of(ApiResponse.fail('Failed to get currencies')))
        )
    }
}
