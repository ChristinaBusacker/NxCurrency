import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { CurrencyService } from './currency.service';
import { CachingService } from '../../../common/caching/caching.service';
import { Currency } from '@shared/interfaces/currency.interface';

const response: { data: { [key: string]: Currency } } = {
  data: {
    USD: { symbol: '$', name: 'United States Dollar', decimal_digits: 2, code: 'USD' },
    EUR: { symbol: '€', name: 'Euro', decimal_digits: 2, code: 'EUR' }
  }
};

describe('CurrencyService', () => {
  let service: CurrencyService;
  let httpService: HttpService;
  let configService: ConfigService;
  let cachingService: CachingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(() => of({ data: response }))
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'FREECURRENCYAPI_URL') return 'http://api.example.com/api';
              if (key === 'FREECURRENCYAPI_KEY') return 'apikey123';
            })
          },
        },
        {
          provide: CachingService,
          useValue: {
            getAvailibleCurrencies: jest.fn().mockReturnValue([]),
            cacheAvailibleCurrencies: jest.fn(),
            getCurrencyRate: jest.fn(),
            setCurrencyRate: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<CurrencyService>(CurrencyService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
    cachingService = module.get<CachingService>(CachingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAvailableCurrencies', () => {
    it('should return cached currencies if available', (done) => {
      const cachedCurrencies: Currency[] = [
        { symbol: '$', name: 'United States Dollar', decimal_digits: 2, code: 'USD' },
        { symbol: '€', name: 'Euro', decimal_digits: 2, code: 'EUR' }
      ];

      jest.spyOn(cachingService, 'getAvailibleCurrencies').mockReturnValue(cachedCurrencies);

      service.getAvailableCurrencies().subscribe(data => {
        expect(data).toEqual(cachedCurrencies);
        expect(cachingService.getAvailibleCurrencies).toHaveBeenCalled();
        done();
      });
    });

    it('should fetch currencies if not available in cache', (done) => {
      jest.spyOn(cachingService, 'getAvailibleCurrencies').mockReturnValue([]);

      service.getAvailableCurrencies().subscribe(data => {
        expect(data).toEqual([
          { symbol: '$', name: 'United States Dollar', decimal_digits: 2, code: 'USD' },
          { symbol: '€', name: 'Euro', decimal_digits: 2, code: 'EUR' }
        ]);
        expect(httpService.get).toHaveBeenCalled();
        expect(cachingService.cacheAvailibleCurrencies).toHaveBeenCalled();
        done();
      });

      expect(httpService.get).toHaveBeenCalledWith('http://api.example.com/api/currencies', {
        params: {
          apikey: 'apikey123',
        },
      });
    });
  });
});
