import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Documento } from '../interfaces/documento';
import { Injectable, signal, inject, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidadorService {

  private myAppUrl: string;
  private myAPIUrl: string;
  private http = inject( HttpClient );

  constructor() {
    this.myAppUrl = 'http://localhost:3001/'; //'https://dev4.siasaf.gob.mx/'  //'http://localhost:3001/'
    this.myAPIUrl = 'api/solicitud';

  }

  getSolicitudes(data: FormData): Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myAPIUrl}/getsolicitudes`, data)
  }
}
