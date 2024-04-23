import { Injectable } from '@nestjs/common';
import { Currency } from '@shared/interfaces/currency.interfaces';


interface CurrencyRateCache {
    [key: string]: { rate: number; timestamp: Date };
}

interface AvailableCurrenciesCache {
    values: Currency[];
}

/*
    I chose an "in-memory cache" here because it is completely sufficient for our needs. 
    The cache manager @nestjs/cache-manager provides more complexity than we really need 
    to reduce API calls.
*/

@Injectable()
export class CachingService {

    private availableCurrenciesCache: AvailableCurrenciesCache = { values: [] };
    private currencyRateCache: CurrencyRateCache = {};

    public setCurrencyRate(fromCurrency: string, targetCurrency: string, rate: number): string {
        const cacheKey = `${fromCurrency}_${targetCurrency}`
        this.currencyRateCache[cacheKey] = { rate, timestamp: new Date() }
        return cacheKey
    }

    public getCurrencyRate(fromCurrency: string, targetCurrency: string): number | null {

        /*          
        * We can reuse cached values with the same currencies aswell. 
        * € => $ ===  1/$ => € 
        */
        const cacheKey = Object.keys(this.currencyRateCache).find(key =>
            key === `${fromCurrency}_${targetCurrency}` || key === `${targetCurrency}_${fromCurrency}`
        );
        const cached = this.currencyRateCache[cacheKey];

        if (cached && (new Date().getTime() - cached.timestamp.getTime()) < 24 * 60 * 60 * 1000) {
            if (cached.rate !== 0) {
                return cacheKey.startsWith(fromCurrency) ? cached.rate : 1 / cached.rate
            }
        }

        return null
    }

    /*
     * I'm breaking the naming convention here because setAvailibleCurrencies can be misleading 
     * in other code places.
    */
    public cacheAvailibleCurrencies(values: Currency[]): void {
        this.availableCurrenciesCache = { values }
    }

    public getAvailibleCurrencies(): Currency[] {
        return this.availableCurrenciesCache.values;
    }
}
