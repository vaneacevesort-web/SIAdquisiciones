import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KpiService {
  private _sol   = new BehaviorSubject<number>(0);
  private _est   = new BehaviorSubject<number>(0);
  private _afect = new BehaviorSubject<number>(0);
  private _adq   = new BehaviorSubject<number>(0);
  private _adj   = new BehaviorSubject<number>(0);

  sol$   = this._sol.asObservable();
  est$   = this._est.asObservable();
  afect$ = this._afect.asObservable();
  adq$   = this._adq.asObservable();
  adj$   = this._adj.asObservable();

  calcular(data: any[]): void {
    const n = (r: any) => {
      const v = r.estatus_id;
      if (typeof v === 'boolean') return v ? 1 : 0;
      return Number(v) || 0;
    };
    this._sol.next(data.filter(r => n(r) >= 1).length);
    this._est.next(data.filter(r => n(r) >= 2).length);
    this._afect.next(data.filter(r => n(r) >= 3).length);
    this._adq.next(data.filter(r => n(r) >= 4).length);
    this._adj.next(data.filter(r => n(r) >= 5).length);
  }
}
