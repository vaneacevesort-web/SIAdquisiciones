import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Documento } from '../interfaces/documento';
import { Injectable, signal, inject, computed } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  private myAppUrl: string;
  private myAPIUrl: string;
  private http = inject( HttpClient );

  constructor() {
    this.myAppUrl = 'http://localhost:3001/'; //'https://dev4.siasaf.gob.mx/'  //'http://localhost:3001/'
    this.myAPIUrl = 'api/documentos';

  }

  saveDocumentos(document: FormData, user : String): Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myAPIUrl}/create/${user}`,document)
  }

  getDocumentosUser(user : String): Observable<string> {
    return this.http.get<string>(`${this.myAppUrl}${this.myAPIUrl}/getdocumentos/${user}`)
  }

  sendDocumentos(user : String): Observable<void> {
    return this.http.get<void>(`${this.myAppUrl}${this.myAPIUrl}/envestatus/${user}`)
  }

  sendValidacion(documentos: any[], user: String): Observable<void> {
    return this.http.post<void>(`${this.myAppUrl}${this.myAPIUrl}/validadoc/${user}`, documentos);
  }

  deleteDocumento(documentos: any): Observable<void> {
    return this.http.post<void>(`${this.myAppUrl}${this.myAPIUrl}/deleted`, documentos);
  }

  getDocsZip(id: string): Observable<Blob> {
    return this.http.get(`${this.myAppUrl}${this.myAPIUrl}/getdoczips/${id}`, {
      responseType: 'blob' as 'blob',
    });
  }
  
}
