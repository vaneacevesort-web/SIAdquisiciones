import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CargaMasivaService {

  private readonly baseUrl = 'http://localhost:3001/api/carga-masiva';
  private http = inject(HttpClient);

  validar(archivo: File): Observable<unknown> {
    const form = new FormData();
    form.append('archivo', archivo);
    return this.http.post(`${this.baseUrl}/validar`, form);
  }

  // El archivo ya fue procesado en validar(). Solo se envía el token.
  importar(token: string): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/importar`, { token });
  }
}
