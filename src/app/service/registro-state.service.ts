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

  setIdSolicitud(id: number) {
    localStorage.setItem('idSolicitudRegistro', String(id));
  }

  getIdSolicitud(): number | null {
    const id = localStorage.getItem('idSolicitudRegistro');
    return id ? Number(id) : null;
  }

  clear() {
    localStorage.removeItem('datosGeneralesRegistro');
    localStorage.removeItem('idSolicitudRegistro');
  }
}