// Import-Statements
import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { CurrencyService } from './currency.service';
import { FreecurrencyapiResponse } from '@shared/interfaces/currency.interfaces';
import { AxiosHeaders, AxiosResponse } from 'axios';


const response: AxiosResponse<FreecurrencyapiResponse> = {
  data: {
    data: {
      USD: { symbol: '$', name: 'United States Dollar', decimal_digits: 2, code: 'USD' },
      EUR: { symbol: '€', name: 'Euro', decimal_digits: 2, code: 'EUR' }
    }
  }
  ,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {
    headers: new AxiosHeaders()
  }
};

describe('CurrencyService', () => {
  let service: CurrencyService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyService,
        {
          provide: HttpService,
          useValue: { get: jest.fn(() => of(response)) },
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
      ],
    }).compile();

    service = module.get<CurrencyService>(CurrencyService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAvailableCurrencies', () => {
    it('should return an array of currencies', (done) => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'FREECURRENCYAPI_URL') return 'http://api.example.com/api';
        if (key === 'FREECURRENCYAPI_KEY') return 'apikey123';
      });

      jest.spyOn(httpService, 'get').mockImplementation(() => of(response));

      service.getAvailableCurrencies().subscribe({
        next: (data) => {
          expect(data).toEqual([
            { symbol: '$', name: 'United States Dollar', decimal_digits: 2, code: 'USD' },
            { symbol: '€', name: 'Euro', decimal_digits: 2, code: 'EUR' }
          ]);
          done();
        },
        error: done.fail,
      });

      expect(httpService.get).toHaveBeenCalledWith('http://api.example.com/api/currencies', {
        params: {
          apikey: 'apikey123',
        },
      });
    });
  });
});
