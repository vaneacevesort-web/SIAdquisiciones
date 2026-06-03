import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CargaMasivaService } from '../../../service/carga-masiva.service';

type Estado = 'idle' | 'archivo_listo' | 'validando' | 'resultado' | 'importando' | 'importado';

interface FilaResultado {
  fila: number;
  folio: string;
  estado: 'ok' | 'advertencia' | 'error';
  errores: string[];
  advertencias: string[];
}

interface ResultadoValidacion {
  total: number;
  validos: number;
  errores_count: number;
  advertencias_count: number;
  filas: FilaResultado[];
}

interface ResultadoImportacion {
  importados: number;
  omitidos: number;
  filas: FilaResultado[];
}

@Component({
  selector: 'app-carga-masiva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carga-masiva.component.html',
  styleUrl: './carga-masiva.component.scss',
})
export class CargaMasivaComponent {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  estado: Estado = 'idle';
  archivo: File | null = null;
  token: string | null = null;         // devuelto por /validar, consumido por /importar
  validacion: ResultadoValidacion | null = null;
  importacion: ResultadoImportacion | null = null;
  mensajeError = '';

  // Vista previa: solo muestra filas con problemas por defecto, toggle para todas
  mostrarSoloProblemas = true;

  private service = inject(CargaMasivaService);

  // ── Archivo ───────────────────────────────────────────────────────────────

  abrirSelector(): void {
    this.fileInput.nativeElement.click();
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (!file) return;

    this.archivo    = file;
    this.validacion = null;
    this.importacion = null;
    this.mensajeError = '';
    this.estado = 'archivo_listo';
  }

  // ── Validar ───────────────────────────────────────────────────────────────

  validar(): void {
    if (!this.archivo || this.estado === 'validando') return;
    this.estado = 'validando';
    this.mensajeError = '';

    this.service.validar(this.archivo).subscribe({
      next: (resp) => {
        const r = resp as ResultadoValidacion & { token: string };
        this.token     = r.token;
        this.validacion = r;
        this.estado = 'resultado';
      },
      error: (err) => {
        const e = err as any;
        this.mensajeError = e?.error?.msg ?? 'Error al validar el archivo. Intente de nuevo.';
        this.estado = 'archivo_listo';
      },
    });
  }

  // ── Importar ──────────────────────────────────────────────────────────────

  importar(): void {
    const token = this.token;
    if (!token || this.estado === 'importando') return;
    this.estado = 'importando';
    this.mensajeError = '';

    this.service.importar(token).subscribe({
      next: (resp) => {
        this.importacion = resp as ResultadoImportacion;
        this.estado = 'importado';
      },
      error: (err) => {
        const e = err as any;
        const msg    = e?.error?.msg    ?? 'Error al importar los datos. Intente de nuevo.';
        const detail = e?.error?.detail ?? '';
        this.mensajeError = detail ? `${msg}\n\nDetalle: ${detail}` : msg;
        this.estado = 'resultado';
      },
    });
  }

  // ── Reset ─────────────────────────────────────────────────────────────────

  reiniciar(): void {
    this.archivo      = null;
    this.token        = null;
    this.validacion   = null;
    this.importacion  = null;
    this.mensajeError = '';
    this.estado       = 'idle';
    if (this.fileInput) this.fileInput.nativeElement.value = '';
  }

  // ── Helpers de vista ─────────────────────────────────────────────────────

  get filasFiltradas(): FilaResultado[] {
    const filas = this.estado === 'importado'
      ? (this.importacion?.filas ?? [])
      : (this.validacion?.filas ?? []);
    return this.mostrarSoloProblemas
      ? filas.filter(f => f.estado !== 'ok')
      : filas;
  }

  get hayErroresCriticos(): boolean {
    return (this.validacion?.errores_count ?? 0) > 0;
  }

  // Puede importar si hay al menos un registro válido,
  // aunque haya errores — los errores se omiten, los válidos se insertan.
  get puedeImportar(): boolean {
    return this.estado === 'resultado' && (this.validacion?.validos ?? 0) > 0;
  }

  get nombreArchivo(): string {
    return this.archivo?.name ?? '';
  }

  get tamanoArchivo(): string {
    if (!this.archivo) return '';
    const kb = this.archivo.size / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
  }

  // ── Descarga de errores ───────────────────────────────────────────────────

  get filasConProblemas(): FilaResultado[] {
    const fuente = this.estado === 'importado'
      ? (this.importacion?.filas ?? [])
      : (this.validacion?.filas ?? []);
    return fuente.filter(f => f.estado !== 'ok');
  }

  descargarErrores(): void {
    const filas = this.filasConProblemas;
    if (filas.length === 0) return;

    const encabezado = ['Fila', 'Folio', 'Estado', 'Errores', 'Advertencias'].join(',');
    const cuerpo = filas.map(f => [
      f.fila,
      `"${f.folio}"`,
      f.estado,
      `"${f.errores.join(' | ')}"`,
      `"${f.advertencias.join(' | ')}"`,
    ].join(',')).join('\n');

    // BOM UTF-8 para que Excel abra el CSV con acentos correctamente
    const blob = new Blob(['﻿' + encabezado + '\n' + cuerpo], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `errores_carga_masiva_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
