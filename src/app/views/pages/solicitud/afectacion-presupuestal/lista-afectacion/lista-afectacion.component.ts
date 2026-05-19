import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { RegistroService } from '../../../../../service/registro.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ColumnMode, DatatableComponent, NgxDatatableModule } from '@siemens/ngx-datatable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-lista-afectacion',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, NgxDatatableModule],
  templateUrl: './lista-afectacion.component.html',
  styleUrl: './lista-afectacion.component.scss'
})
export class ListaAfectacionComponent implements OnInit {

  originalData: any[] = [];
  temp: any[] = [];
  rows: any[] = [];
  page: number = 0;
  pageSize: number = 10;
  filteredCount: number = 0;
  loading: boolean = true;
  titulo: string = 'Afectaciones presupuestales';
  tipoEstatus: number = 0;

  @ViewChild('table') table!: DatatableComponent;

  private registroService = inject(RegistroService);
  private router = inject(Router);

  navegar(id: any): void {
    const idNum = parseInt(id, 10);
    if (!isNaN(idNum) && idNum > 0) {
      this.router.navigate(['/solicitud/afectacion-presupuestal', idNum]);
    }
  }

  ngOnInit(): void {
    this.cargarSolicitudesAfectacion();
  }

  cargarSolicitudesAfectacion(): void {
    this.registroService.getSolicitudesAfectacion().subscribe({
      next: (resp: any) => {
        console.log('SOLICITUDES AFECTACIÓN =>', resp);
        const data = resp?.data || resp || [];
        this.originalData = Array.isArray(data) ? [...data] : [];
        this.temp = [...this.originalData];
        this.filteredCount = this.temp.length;
        this.setPage({ offset: 0 });
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('ERROR AL CARGAR AFECTACIÓN =>', error);
        this.loading = false;
      }
    });
  }

  setPage(pageInfo: any): void {
    this.page = pageInfo.offset;
    const start = this.page * this.pageSize;
    const end = start + this.pageSize;
    this.rows = this.temp.slice(start, end);
  }

  onSort(event: any): void {
    const sort = event.sorts[0];
    const prop = sort.prop;
    const dir = sort.dir;

    this.temp.sort((a, b) => {
      let valA = a[prop];
      let valB = b[prop];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === 'string') {
        return dir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      return dir === 'asc' ? valA - valB : valB - valA;
    });

    this.setPage({ offset: 0 });
  }

  updateFilter(event: any): void {
    const val = (event.target?.value || '').toLowerCase();
    this.temp = this.originalData.filter((row: any) =>
      Object.values(row).some(
        (field) => field && field.toString().toLowerCase().includes(val)
      )
    );
    this.filteredCount = this.temp.length;
    this.setPage({ offset: 0 });
  }

  exportToExcel(): void {
    const exportData = this.temp.map((row, index) => ({
      'N': index + 1,
      'Folio': row.folio || '',
      'Fecha Ingreso': this.formatDate(row.fecha_ingreso),
      'Tipo Solicitud': row.tipo_solicitud || '',
      'Origen Recurso': row.origen_recurso_nombre || this.getOrigenRecursoNombre(row.id_origen_recurso),
      'Dependencia': row.dependencia_nombre || '',
      'Centro de Costo': row.centro_costo_nombre || row.opd_nombre || '',
      'Capítulo': row.capitulo_nombre || this.getCapituloNombre(row.id_capitulo),
      'Estatus': this.getEstatusNombre(row.estatus_id)
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    worksheet['!cols'] = [
      { wch: 6 }, { wch: 20 }, { wch: 18 }, { wch: 22 },
      { wch: 22 }, { wch: 25 }, { wch: 22 }, { wch: 40 }, { wch: 15 }
    ];

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Afectaciones': worksheet },
      SheetNames: ['Afectaciones']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    FileSaver.saveAs(blob, 'Afectaciones_Presupuestales.xlsx');
  }

  getOrigenRecursoNombre(id: number): string {
    switch (Number(id)) {
      case 1: return 'Estatal';
      case 2: return 'Federal';
      case 3: return 'Fideicomiso';
      case 4: return 'Concurrente o Propio';
      default: return '';
    }
  }

  getCapituloNombre(id: number): string {
    switch (Number(id)) {
      case 1: return '1000 - Servicios Personales';
      case 2: return '2000 - Materiales y Suministros';
      case 3: return '3000 - Servicios Generales';
      case 4: return '4000 - Transferencias, Asignaciones, Subsidios y Otras Ayudas';
      case 5: return '5000 - Bienes Muebles, Inmuebles e Intangibles';
      case 6: return '6000 - Inversión Pública';
      case 7: return '7000 - Inversiones Financieras y Otras Provisiones';
      case 8: return '8000 - Participaciones y Aportaciones';
      case 9: return '9000 - Deuda Pública';
      default: return '';
    }
  }

  getEstatusNombre(estatusId: number): string {
    switch (estatusId) {
      case 1: return 'Registrado';
      case 2: return 'Pendiente';
      case 3: return 'Validado';
      case 4: return 'Rechazado';
      default: return 'Desconocido';
    }
  }

  formatDate(fecha: string | Date): string {
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
