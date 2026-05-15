import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ValidadorService } from '../../../service/validador.service';
import { UserService } from '../../../service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ColumnMode, DatatableComponent, NgxDatatableModule } from '@siemens/ngx-datatable';
import { RouterModule } from '@angular/router';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { RegistroService } from '../../../service/registro.service';

@Component({
  selector: 'app-lista-validador',
  imports: [NgxDatatableModule, CommonModule, RouterModule],
  templateUrl: './lista-validador.component.html',
  styleUrl: './lista-validador.component.scss'
})
export class ListaValidadorComponent {
  originalData: any[] = [];
  temp: any[] = [];
  rows: any[] = [];
  page: number = 0;
  pageSize: number = 10;
  filteredCount: number = 0;
  loading: boolean = true;
  rutaActual: string = '';
  titulo: string = '';
  tipoEstatus: number = 0;
  public _userService = inject(UserService);
  public _validadorService = inject(ValidadorService);
  public _registroService = inject(RegistroService);

  @ViewChild('table') table: DatatableComponent;


  constructor(private router: Router) { }

  ngOnInit(): void {
    this.rutaActual = this.router.url;
    if (this.rutaActual.includes('estudiodemercado')) {
      this.titulo = 'Solicitudes en tramite'
      this.tipoEstatus = 2;

    } else if (this.rutaActual.includes('afectacionpresupuestal')) {
      this.titulo = 'Solicitudes finalizadas'
      this.tipoEstatus = 3;

    } else if (this.rutaActual.includes('rechazados')) {
      this.titulo = 'Solicitudes rechazadas'
      this.tipoEstatus = 4;
    }else if(this.rutaActual.includes('registradas')){
      this.titulo='Solicitudes registradas'
      this.tipoEstatus = 5;
    }
    console.log(this.tipoEstatus)

    const payload: any = {};
    if (this._userService.currentUserValue?.id !== undefined) {
      payload.usuario = this._userService.currentUserValue.id;
    }
    if (typeof this.tipoEstatus !== 'undefined') {
      payload.id = this.tipoEstatus;
    }

    this._registroService.getRegistros().subscribe({
      next: (response: any) => {

        const data = response?.data || response?.data?.data || response || [];

         console.log('DATA FINAL =>', data);

        this.originalData = Array.isArray(data) ? [...data] : [];
        this.temp = [...this.originalData];
        this.filteredCount = this.temp.length;
        this.setPage({ offset: 0 });
        this.loading = false;

      },
      error: (e: HttpErrorResponse) => {
        const msg = e.error?.msg || 'Error desconocido';
        console.error('Error del servidor:', msg);
      }
    });
  }

  setPage(pageInfo: any) {
    this.page = pageInfo.offset;
    const start = this.page * this.pageSize;
    const end = start + this.pageSize;
    this.rows = this.temp.slice(start, end);
  }

  onSort(event: any) {
    const sort = event.sorts[0];
    const prop = sort.prop;
    const dir = sort.dir;

    this.temp.sort((a, b) => {
      let valA: any, valB: any;

      if (prop === 'nombreCompleto') {
        valA = `${a.ap_paterno} ${a.ap_materno} ${a.nombres}`.toLowerCase();
        valB = `${b.ap_paterno} ${b.ap_materno} ${b.nombres}`.toLowerCase();
      } else if (prop === 'fecha_envio') {
        valA = new Date(a.fecha_envio).getTime();
        valB = new Date(b.fecha_envio).getTime();
      } else {
        valA = a[prop];
        valB = b[prop];
      }

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === 'string') {
        return dir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      return dir === 'asc' ? valA - valB : valB - valA;
    });

    this.setPage({ offset: 0 }); // Vuelve a mostrar la primera página
  }

  
  updateFilter(event: any) {
    const val = (event.target?.value || '').toLowerCase();
    this.temp = this.originalData.filter((row: any) => {
      return Object.values(row).some((field) => {
        return field && field.toString().toLowerCase().includes(val);
      });
    });

    this.filteredCount = this.temp.length;
    this.setPage({ offset: 0 });
  }

 exportToExcel(): void {
  const exportData = this.temp.map((row, index) => ({
    'N': index + 1,
    'Folio Interno de Solicitud': row.folio || '',
    'Fecha Ingreso de Solicitud': this.formatDate(row.fecha_ingreso),
    'Origen de Recurso': row.origen_recurso_nombre || '',
    'Dependencia': row.dependencia_nombre || '',
    'Centro de Costo': row.centro_costo_nombre || row.opd_nombre || '',
    'Capítulo': row.capitulo_nombre || '',
    'Partida Genérica': row.partida_generica_nombre || '',
    'Partida Específica': row.partida_especifica_nombre || '',
    'Tipo de Solicitud': row.tipo_solicitud || '',
    'Valor del Estudio de Mercado': row.valor_estudio_mercado || '',
    'Estatus del Estudio de Mercado': row.estatus_estudio_mercado || '',
    'Monto SABYS': row.monto_sabys || '',
    'Descripción del bien o servicio': row.descripcion_bien_servicio || '',
    'Contratación Plurianual': row.contratacion_plurianual || '',
    'Monto 2026': row.monto_2026 || '',
    'Monto 2027': row.monto_2027 || '',
    'Monto 2028': row.monto_2028 || '',
    'Monto 2029': row.monto_2029 || '',
    'Estatus': this.getEstatusNombre(row.estatus_id)
  }));

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 28 },
    { wch: 24 },
    { wch: 20 },
    { wch: 25 },
    { wch: 20 },
    { wch: 15 },
    { wch: 18 },
    { wch: 18 },
    { wch: 20 },
    { wch: 20 },
    { wch: 28 },
    { wch: 30 },
    { wch: 18 },
    { wch: 45 },
    { wch: 24 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 }
  ];

  const workbook: XLSX.WorkBook = {
    Sheets: { 'General': worksheet },
    SheetNames: ['General']
  };

  const excelBuffer: any = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  const blob: Blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  FileSaver.saveAs(blob, 'SIAdquisiciones_General.xlsx');
}

  // Devuelve el nombre del estatus como texto
  getEstatusNombre(estatusId: number): string {
    switch (estatusId) {
      case 1: return 'Registrado';
      case 2: return 'Pendiente';
      case 3: return 'Validado';
      case 4: return 'Rechazado';
      default: return 'Desconocido';
    }
  }

getLink(row: any): string[] {
  if (this._userService.currentUserValue?.rol_users?.role?.name == 'Administrador' && this.rutaActual.includes('registradas')) {
    return ['/registro/add-documentos', row.userId];
  }
    return ['/solicitud/validacion', row.userId]; 
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

  formatDate(fecha: string | Date): string {
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return ''; // fecha inválida
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}
