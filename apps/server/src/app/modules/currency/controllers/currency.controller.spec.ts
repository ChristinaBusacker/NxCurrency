import { Test, TestingModule } from '@nestjs/testing';
import { lastValueFrom, of, throwError } from 'rxjs';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from '../services/currency.service';

describe('CurrencyController', () => {
  let controller: CurrencyController;
  let currencyService: CurrencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyController],
      providers: [
        {
          provide: CurrencyService,
          useValue: {
            getAvailableCurrencies: jest.fn(),
            convertCurrency: jest.fn()
          },
        },
      ]
    }).compile();

    controller = module.get<CurrencyController>(CurrencyController);
    currencyService = module.get<CurrencyService>(CurrencyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAvailableCurrencies', () => {
    it('should return successful ApiResponse when currencies are fetched successfully', async () => {
      const expectedResult = [{ symbol: '$', name: 'US Dollar', decimal_digits: 2, code: 'USD' }];
      jest.spyOn(currencyService, 'getAvailableCurrencies').mockReturnValue(of(expectedResult));

      const result = await lastValueFrom(controller.getAvailableCurrencies());

      expect(result.data).toEqual(expectedResult);
      expect(result.error).toBeUndefined();
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should return error ApiResponse when service throws an error', async () => {
      const errorMessage = 'Failed to get currencies';
      jest.spyOn(currencyService, 'getAvailableCurrencies').mockReturnValue(throwError(() => new Error(errorMessage)));

      const result = await lastValueFrom(controller.getAvailableCurrencies());

      expect(result.error).toEqual(errorMessage);
      expect(result.data).toBeNull();
      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('convertCurrency', () => {
    it('should handle currency conversion successfully', async () => {
      const body = { amount: 100, fromCurrency: 'USD', targetCurrency: 'EUR' };
      const convertedAmount = 90;
      jest.spyOn(currencyService, 'convertCurrency').mockReturnValue(of(convertedAmount));

      const result = await lastValueFrom(controller.convertCurrency(body));

      expect(result.data).toEqual(convertedAmount);
      expect(result.error).toBeUndefined();
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should return error in ApiResponse when missing required fields', async () => {
      const body = { amount: 100 }; // Missing fromCurrency and toCurrency
      const result = await lastValueFrom(controller.convertCurrency(body as any));

      expect(result.error).toEqual('Missing required fields: amount, fromCurrency, or toCurrency.');
      expect(result.data).toBeNull();
    });

    it('should return error in ApiResponse when service throws an error', async () => {
      const body = { amount: 100, fromCurrency: 'USD', targetCurrency: 'EUR' };
      const errorMessage = 'Failed to convert currency';
      jest.spyOn(currencyService, 'convertCurrency').mockReturnValue(throwError(() => new Error(errorMessage)));

      const result = await lastValueFrom(controller.convertCurrency(body));

      expect(result.error).toEqual(errorMessage);
      expect(result.data).toBeNull();
      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });
});
