import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistroStateService {

  setDatosGenerales(data: any) {
    localStorage.setItem('datosGeneralesRegistro', JSON.stringify(data));
  }

  getDatosGenerales() {
    const data = localStorage.getItem('datosGeneralesRegistro');
    return data ? JSON.parse(data) : null;
  }

  clear() {
    localStorage.removeItem('datosGeneralesRegistro');
  }
}