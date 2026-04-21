import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private myAppUrl: string;
  private myAPIUrl: string;
  private http = inject(HttpClient);

  constructor() {
    this.myAppUrl = 'http://localhost:3001/';
    this.myAPIUrl = 'api/solicitud';
  }

  saveRegistro(data: any): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myAPIUrl}/create`, data);
  }

  getStatus(user: string): Observable<any> {
    return this.http.get<any>(`${this.myAppUrl}${this.myAPIUrl}/getestatus/${user}`);
  }

  getRegistros(): Observable<any> {
    return this.http.get<any>(`${this.myAppUrl}${this.myAPIUrl}/read`);
  }

  getDependencias(): Observable<any> {
    return this.http.get<any>(`${this.myAppUrl}api/catalogos/dependencias`);
  }

  getCentrosCosto(idDependencia: number): Observable<any> {
    return this.http.get<any>(`${this.myAppUrl}api/catalogos/centros-costo/${idDependencia}`);
  }

  getOrganismosOPDS(): Observable<any> {
    return this.http.get<any>(`${this.myAppUrl}api/catalogos/organismos-opds`);
  }

  getOrganosDesconcentrados(): Observable<any> {
    return this.http.get<any>(`${this.myAppUrl}api/catalogos/organos-desconcentrados`);
  }
}