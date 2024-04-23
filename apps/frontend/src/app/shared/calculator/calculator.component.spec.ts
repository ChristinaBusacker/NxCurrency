import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalculatorComponent } from './calculator.component';
import { CoreModule } from '../../core/core.module';
import { CurrencyConversionService } from '../../core/services/currency-conversion/currency-conversion.service';
import { of } from 'rxjs';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;
  let currencyConversionService: CurrencyConversionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalculatorComponent],
      imports: [CommonModule, FormsModule, ReactiveFormsModule, CoreModule],
      providers: [
        {
          provide: CurrencyConversionService,
          useValue: {
            calculate: jasmine.createSpy('calculate').and.callFake(
              (amount: number, fromCurrency: string, toCurrency: string) => of(amount * 1.2)
            )
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    currencyConversionService = TestBed.inject(CurrencyConversionService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should switch currencies and values correctly', () => {
    component.inputValueControl.setValue(10);
    component.inputCurrencyControl.setValue('EUR');
    component.outputValueControl.setValue(12);
    component.outputCurrencyControl.setValue('USD');

    component.switchcurrencies();

    expect(component.inputValueControl.value).toBe(12);
    expect(component.inputCurrencyControl.value).toBe('USD');
    expect(component.outputValueControl.value).toBe(10);
    expect(component.outputCurrencyControl.value).toBe('EUR');
  });

  it('should convert currencies correctly', () => {
    component.inputValueControl.setValue(100);
    component.inputCurrencyControl.setValue('EUR');
    component.outputCurrencyControl.setValue('USD');

    fixture.detectChanges();

    expect(currencyConversionService.calculate).toHaveBeenCalledWith(100, 'EUR', 'USD');
    expect(component.outputValueControl.value).toBe(120.00);
  });
});
