import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription, combineLatest, debounceTime, map, of, startWith } from 'rxjs';
import { CoreModule } from '../../core/core.module';
import { CurrencyConversionService } from '../../core/services/currency-conversion/currency-conversion.service';
import { HistoryService } from '../../core/services/history/history.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CoreModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss',
})
export class CalculatorComponent implements OnInit, OnDestroy {
  public inputValueControl = new FormControl(0);
  public inputCurrencyControl = new FormControl('EUR');
  public outputValueControl = new FormControl({ value: 0, disabled: true });
  public outputCurrencyControl = new FormControl('USD');

  public defaultOptions = environment.CURRENCY_OPTIONS

  private inputSubscription?: Subscription

  constructor(public currencyConversionService: CurrencyConversionService, private historyService: HistoryService) { }

  public convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Observable<number | null> {
    return this.currencyConversionService.convertCurrency(amount, fromCurrency, toCurrency)
  }

  public switchCurrencies(): void {
    /*
      Simple value switching function between input and output controls.
      I set emitEvent to false to make sure that this isnt handled like
      a user input 
    */

    const inpVal = this.inputValueControl.value;
    const inpCur = this.inputCurrencyControl.value;

    this.inputValueControl.setValue(this.outputValueControl.value, { emitEvent: false });
    this.inputCurrencyControl.setValue(this.outputCurrencyControl.value, { emitEvent: false });
    this.outputValueControl.setValue(inpVal, { emitEvent: false });
    this.outputCurrencyControl.setValue(inpCur, { emitEvent: false });
  }

  public ngOnInit() {
    /*
      I decided to use rxjs for that operation, because it is the Angular 
      way to go. I use debounceTIme for the input debouncing and startWith 
      to make sure, that the combineLatest is triggering before the user
      changes the currencies the first time
    */

    this.inputSubscription = combineLatest([
      this.inputValueControl.valueChanges.pipe(debounceTime(600)),
      this.inputCurrencyControl.valueChanges.pipe(startWith(this.inputCurrencyControl.value)),
      this.outputCurrencyControl.valueChanges.pipe(startWith(this.outputCurrencyControl.value)),
    ]).pipe(
      map(([amount, fromCurrency, toCurrency]) => {
        this.convertCurrency(amount || 0, fromCurrency || 'EUR', toCurrency || 'USD').subscribe((amount) => {
          if (amount) {
            const outputAmount = parseFloat(amount.toFixed(2))
            this.outputValueControl.setValue(outputAmount);
          }
        })
      })
    ).subscribe();
  }

  public ngOnDestroy(): void {
    this.inputSubscription?.unsubscribe()
  }
}
