import { Controller, Get } from '@nestjs/common';
import { CurrencyService } from '../services/currency.service';

@Controller('currency')
export class CurrencyController {
    constructor(private currencyService: CurrencyService) { }

    @Get()
    getData() {
        return this.currencyService.getAvailibleCurrencies();
    }
}
