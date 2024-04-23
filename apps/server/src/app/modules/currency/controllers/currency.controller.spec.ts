import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from '../services/currency.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

describe('CurrencyController', () => {
  let controller: CurrencyController;
  let currencyService: CurrencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyController],
      providers: [
        CurrencyService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(() => of({
              data: { USD: { symbol: '$', name: 'US Dollar', decimal_digits: 2, code: 'USD' } },
              status: 200,
              statusText: 'OK',
              headers: {},
              config: {},
            }))
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation(key => {
              if (key === 'FREECURRENCYAPI_URL') return 'http://api.example.com';
              if (key === 'FREECURRENCYAPI_KEY') return 'apikey123';
            })
          }
        }
      ]
    }).compile();

    controller = module.get<CurrencyController>(CurrencyController);
    currencyService = module.get<CurrencyService>(CurrencyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getData', () => {
    it('should return successful ApiResponse when currencies are fetched successfully', async () => {
      const expectedResult = [{ symbol: '$', name: 'US Dollar', decimal_digits: 2, code: 'USD' }];
      jest.spyOn(currencyService, 'getAvailableCurrencies').mockReturnValue(of(expectedResult));

      const result = await controller.getData().toPromise();

      expect(result.data).toEqual(expectedResult);
      expect(result.error).toBeUndefined();
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should return error ApiResponse when service throws an error', async () => {
      const errorMessage = 'Failed to get currencies';
      jest.spyOn(currencyService, 'getAvailableCurrencies').mockReturnValue(throwError(() => new Error(errorMessage)));

      const result = await controller.getData().toPromise();

      expect(result.error).toEqual(errorMessage);
      expect(result.data).toBeNull();
      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });
});
