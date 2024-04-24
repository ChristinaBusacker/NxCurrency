import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { CurrencyConversionService } from './currency-conversion.service';
import { HistoryService } from '../history/history.service';
import { ApiResponse } from '@shared/models/api-response.dto';
import { Currency } from '@shared/interfaces/currency.interface';

describe('CurrencyConversionService', () => {
  let service: CurrencyConversionService;
  let httpClientMock: jest.Mocked<HttpClient>;
  let historyServiceMock: jest.Mocked<HistoryService>;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn(),
      post: jest.fn()
    } as any; // Type casting to avoid TypeScript errors on partial mock

    historyServiceMock = {
      setCalculationHistoryEntry: jest.fn()
    } as any; // Mock all methods used in the service

    TestBed.configureTestingModule({
      providers: [
        CurrencyConversionService,
        { provide: HttpClient, useValue: httpClientMock },
        { provide: HistoryService, useValue: historyServiceMock }
      ]
    });

    service = TestBed.inject(CurrencyConversionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('convertCurrency', () => {
    it('should return the converted amount and log the conversion in history on success', () => {
      const mockResponse: ApiResponse<number> = {
        success: true,
        data: 150,
        timestamp: new Date().toISOString(),
        error: null
      };

      httpClientMock.post.mockReturnValue(of(mockResponse));

      service.convertCurrency(100, 'USD', 'EUR').subscribe(result => {
        expect(result).toBe(150);
        expect(historyServiceMock.setCalculationHistoryEntry).toHaveBeenCalledWith({
          timestamp: mockResponse.timestamp,
          inputAmount: 100,
          inputCurrency: 'USD',
          outputCurrency: 'EUR',
          outputAmount: 150
        });
      });
    });

    it('should return null and log an error on failure', () => {
      const mockResponse: ApiResponse<number> = {
        success: false,
        data: null,
        timestamp: '',
        error: 'Conversion failed'
      };

      httpClientMock.post.mockReturnValue(of(mockResponse));
      console.error = jest.fn(); // Mock console.error to verify it's being called

      service.convertCurrency(100, 'USD', 'EUR').subscribe(result => {
        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalledWith('Conversion failed');
      });
    });
  });

  describe('getAvailableCurrencies', () => {
    it('should return an array of currencies on success', () => {
      const mockResponse: ApiResponse<Currency[]> = {
        success: true,
        data: [
          { symbol: "€", name: "Euro", decimal_digits: 2, code: "EUR" },
          { symbol: "$", name: "US Dollar", decimal_digits: 2, code: "USD" }
        ],
        timestamp: '',
        error: null
      };

      httpClientMock.get.mockReturnValue(of(mockResponse));

      service.getAvailableCurrencies().subscribe(currencies => {
        expect(currencies.length).toBe(2);
        expect(currencies).toEqual(mockResponse.data);
      });
    });

    it('should return an empty array and log an error on failure', () => {
      const mockResponse: ApiResponse<Currency[]> = {
        success: false,
        data: [],
        timestamp: '',
        error: 'Unable to fetch currencies'
      };

      httpClientMock.get.mockReturnValue(of(mockResponse));
      console.error = jest.fn(); // Mock console.error to verify it's being called

      service.getAvailableCurrencies().subscribe(currencies => {
        expect(currencies).toEqual([]);
        expect(console.error).toHaveBeenCalledWith('Unable to fetch currencies');
      });
    });
  });
});
