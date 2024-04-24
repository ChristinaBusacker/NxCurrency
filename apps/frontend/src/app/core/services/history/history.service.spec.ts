import { TestBed } from '@angular/core/testing';
import { HistoryService } from './history.service';
import { HistoryEntry } from '../../interfaces/history.interface';
import { environment } from '../../../environments/environment';

describe('HistoryService', () => {
  let service: HistoryService;
  const mockLocalStorage: any = {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HistoryService]
    });

    service = TestBed.inject(HistoryService);

    // Create a full localStorage mock
    const localStorageMock = {
      getItem: jest.fn((key: string) => mockLocalStorage[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        mockLocalStorage[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete mockLocalStorage[key];
      }),
      clear: jest.fn(() => {
        Object.keys(mockLocalStorage).forEach(key => delete mockLocalStorage[key]);
      }),
      key: jest.fn((index: number) => Object.keys(mockLocalStorage)[index] || null),
      length: Object.keys(mockLocalStorage).length
    };

    // Replace global localStorage with the mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve the history from local storage on initialization', () => {
    const items: HistoryEntry[] = [
      { timestamp: '2022-01-01T12:00:00.000Z', inputAmount: 100, inputCurrency: 'USD', outputAmount: 120, outputCurrency: 'EUR' }
    ];
    mockLocalStorage[environment.HISTORYKEY.calulations] = JSON.stringify(items);
    service = TestBed.inject(HistoryService);

    expect(service.getCalculationHistory()).toBeTruthy();
    service.getCalculationHistory().subscribe(data => {
      expect(data).toEqual(items);
    });
  });

  it('should add a new history entry', () => {
    const newEntry: HistoryEntry = {
      timestamp: '2023-01-01T12:00:00.000Z',
      inputAmount: 200,
      inputCurrency: 'EUR',
      outputAmount: 250,
      outputCurrency: 'USD'
    };
    service.setCalculationHistoryEntry(newEntry);
    expect(JSON.parse(mockLocalStorage[environment.HISTORYKEY.calulations])).toContainEqual(newEntry);
  });

  it('should clear the history', () => {
    service.clearCalculationHistory();
    expect(JSON.parse(mockLocalStorage[environment.HISTORYKEY.calulations])).toEqual([]);
  });
});
