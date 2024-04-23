import { CachingService } from './caching.service';
import { Currency } from '@shared/interfaces/currency.interfaces';

describe('CachingService', () => {
  let service: CachingService;

  beforeEach(() => {
    service = new CachingService();
  });

  describe('setCurrencyRate and getCurrencyRate', () => {
    it('should cache currency rates correctly', () => {
      service.setCurrencyRate('USD', 'EUR', 0.85);
      expect(service.getCurrencyRate('USD', 'EUR')).toBe(0.85);
    });

    it('should return null if currency rate is not in cache', () => {
      expect(service.getCurrencyRate('USD', 'EUR')).toBeNull();
    });

    it('should handle currency inversion', () => {
      service.setCurrencyRate('USD', 'EUR', 0.85);
      expect(service.getCurrencyRate('EUR', 'USD')).toBeCloseTo(1 / 0.85);
    });

    it('should return null if the cached rate is expired', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date());

      service.setCurrencyRate('USD', 'EUR', 0.85);
      // Simulate passing of 24 hours and 1 second
      jest.advanceTimersByTime(24 * 60 * 60 * 1000 + 1000);

      expect(service.getCurrencyRate('USD', 'EUR')).toBeNull();
      jest.useRealTimers();
    });

    it('should not return inverted rate if direct rate is zero to avoid division by zero', () => {
      service.setCurrencyRate('USD', 'EUR', 0);
      expect(service.getCurrencyRate('EUR', 'USD')).toBeNull();
    });
  });

  describe('cacheAvailableCurrencies and getAvailableCurrencies', () => {
    it('should cache available currencies correctly', () => {
      const currencies: Currency[] = [
        { code: 'USD', name: 'US Dollar', symbol: '$', decimal_digits: 2 },
        { code: 'EUR', name: 'Euro', symbol: '€', decimal_digits: 2 }
      ];
      service.cacheAvailibleCurrencies(currencies);
      expect(service.getAvailibleCurrencies()).toEqual(currencies);
    });

    it('should return an empty array if no currencies are cached', () => {
      expect(service.getAvailibleCurrencies()).toEqual([]);
    });
  });
});
