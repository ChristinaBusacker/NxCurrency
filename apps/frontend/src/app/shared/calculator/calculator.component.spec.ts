import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CalculatorComponent } from './calculator.component';
import { CurrencyConversionService } from '../../core/services/currency-conversion/currency-conversion.service';
import { of } from 'rxjs';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;
  let currencyConversionServiceMock: any;

  beforeEach(async () => {
    currencyConversionServiceMock = {
      convertCurrency: jest.fn().mockReturnValue(of(100))
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        CalculatorComponent
      ],
      providers: [
        { provide: CurrencyConversionService, useValue: currencyConversionServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly call convertCurrency and set output on valid input', async () => {
    component.inputValueControl.setValue(50);
    component.inputCurrencyControl.setValue('USD');
    component.outputCurrencyControl.setValue('EUR');

    await fixture.whenStable();

    setTimeout(() => {
      expect(currencyConversionServiceMock.convertCurrency).toHaveBeenCalledWith(50, 'USD', 'EUR');
      expect(component.outputValueControl.value).toBe(100);
    }, 650);


  });

  it('should switch currency values correctly', () => {
    component.inputValueControl.setValue(50);
    component.inputCurrencyControl.setValue('USD');
    component.outputValueControl.setValue(100);
    component.outputCurrencyControl.setValue('EUR');

    component.switchCurrencies();

    expect(component.inputValueControl.value).toBe(100);
    expect(component.inputCurrencyControl.value).toBe('EUR');
    expect(component.outputValueControl.value).toBe(50);
    expect(component.outputCurrencyControl.value).toBe('USD');
  });
});
