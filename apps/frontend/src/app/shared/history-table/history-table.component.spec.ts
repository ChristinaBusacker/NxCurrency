import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryTableComponent } from './history-table.component';
import { HistoryService } from '../../core/services/history/history.service';
import { of } from 'rxjs';

describe('HistoryTableComponent', () => {
  let component: HistoryTableComponent;
  let fixture: ComponentFixture<HistoryTableComponent>;
  let historyServiceMock: any;

  beforeEach(async () => {
    historyServiceMock = {
      getCalculationHistory: jest.fn().mockReturnValue(of([])), // return an empty array by default
      clearCalculationHistory: jest.fn() // Mock clearCalculationHistory
    };

    await TestBed.configureTestingModule({
      imports: [
        HistoryTableComponent // Import the standalone component directly
      ],
      providers: [
        { provide: HistoryService, useValue: historyServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers initial data binding and ngOnInit
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load history from the service', () => {
    const expectedHistory = [
      { timestamp: "2020-01-01T00:00:00Z", inputAmount: 100, inputCurrency: "USD", outputAmount: 85, outputCurrency: "EUR" }
    ];
    historyServiceMock.getCalculationHistory.mockReturnValue(of(expectedHistory));
    component.history$.subscribe(data => {
      expect(data).toEqual(expectedHistory);
      expect(data.length).toBe(1);
      expect(data[0].inputAmount).toBe(100);
    });
  });
});
