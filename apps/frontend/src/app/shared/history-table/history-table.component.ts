import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { HistoryService } from '../../core/services/history/history.service';

import { environment } from '../../environments/environment';
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

  constructor(private historyService: HistoryService) { }

  public clearHistory() {
    this.historyService.clearCalculationHistory()
  }
}
