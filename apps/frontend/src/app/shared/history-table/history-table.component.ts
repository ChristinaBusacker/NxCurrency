import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { HistoryService } from '../../core/services/history/history.service';
import { HistoryEntry } from '@shared/interfaces/history.interface';

@Component({
  selector: 'app-history-table',
  standalone: true,
  imports: [CommonModule, CoreModule],
  templateUrl: './history-table.component.html',
  styleUrl: './history-table.component.scss',
})
export class HistoryTableComponent implements OnInit {
  public history: HistoryEntry[] = []

  constructor(private historyService: HistoryService) { }

  public ngOnInit(): void {
    this.historyService.getCalculationHistory().subscribe(history => {
      this.history = history
    })
  }
}
