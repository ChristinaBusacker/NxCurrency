import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { HistoryService } from '../../core/services/history/history.service';

import { environment } from '../../environments/environment';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Observable } from 'rxjs';
import { HistoryEntry } from '../../core/interfaces/history.interface';

@Component({
  selector: 'app-history-table',
  standalone: true,
  imports: [CommonModule, CoreModule],
  templateUrl: './history-table.component.html',
  styleUrl: './history-table.component.scss',
})
export class HistoryTableComponent {
  public history$: Observable<HistoryEntry[]> = this.historyService.getCalculationHistory()

  public currencyOptions = environment.CURRENCY_OPTIONS

  constructor(private historyService: HistoryService) {
    registerLocaleData(localeDe, 'de-DE', localeDeExtra);
  }

  public formatDate(date: string) {
    return new Date(date).toLocaleTimeString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  public clearHistory() {
    this.historyService.clearCalculationHistory()
  }
}
