import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorComponent } from '../../shared/calculator/calculator.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CalculatorComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent { }
