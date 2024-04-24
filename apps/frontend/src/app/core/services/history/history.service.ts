import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HistoryEntry } from '../../interfaces/history.interface'
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private calculationHistorySubject$ = new BehaviorSubject<HistoryEntry[]>([])
  private calculationHistory: HistoryEntry[] = []

  constructor() {
    const historystring = localStorage.getItem(environment.HISTORYKEY.calulations)
    if (historystring) {
      this.calculationHistory = JSON.parse(historystring)
      this.calculationHistorySubject$.next(this.calculationHistory)
    }
  }

  public getCalculationHistory(): Observable<HistoryEntry[]> {
    return this.calculationHistorySubject$.asObservable()
  }

  public setCalculationHistoryEntry(entry: HistoryEntry): void {
    this.calculationHistory.push(entry);
    localStorage.setItem(environment.HISTORYKEY.calulations, JSON.stringify(this.calculationHistory))
    this.calculationHistorySubject$.next(this.calculationHistory)
  }

  public clearCalculationHistory(): void {
    this.calculationHistory = [];
    localStorage.setItem(environment.HISTORYKEY.calulations, JSON.stringify(this.calculationHistory))
    this.calculationHistorySubject$.next(this.calculationHistory)
  }


}
