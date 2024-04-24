import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorComponent } from '../../shared/calculator/calculator.component';
import { HistoryTableComponent } from '../../shared/history-table/history-table.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CalculatorComponent, HistoryTableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent { }
