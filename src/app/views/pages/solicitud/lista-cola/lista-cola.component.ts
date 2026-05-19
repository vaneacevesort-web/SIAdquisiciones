import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DatatableComponent, NgxDatatableModule } from '@siemens/ngx-datatable';
import { RegistroService } from '../../../../service/registro.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface EtapaConfig {
  titulo: string;
  rutaEditar: string;
}

const ETAPAS: Record<number, EtapaConfig> = {
  1: { titulo: 'Solicitudes registradas',           rutaEditar: '/registro/solicitud' },
  2: { titulo: 'Solicitudes en estudio de mercado', rutaEditar: '/registro/solicitud' },
  3: { titulo: 'Afectación presupuestal',           rutaEditar: '/solicitud/afectacion-presupuestal' },
  4: { titulo: 'Adquisición o Contratación',        rutaEditar: '/solicitud/adquisicion' },
  5: { titulo: 'Adjudicación',                      rutaEditar: '/solicitud/adjudicacion' },
};

@Component({
  selector: 'app-lista-cola',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxDatatableModule],
  templateUrl: './lista-cola.component.html',
  styleUrl: './lista-cola.component.scss',
})
export class ListaColaComponent implements OnInit {

  titulo   = '';
  estatus  = 0;
  rutaEditar = '';

  originalData: any[] = [];
  temp: any[] = [];
  rows: any[] = [];
  page     = 0;
  pageSize = 10;
  filteredCount = 0;
  loading  = true;

  @ViewChild('table') table!: DatatableComponent;

  private route           = inject(ActivatedRoute);
  private router          = inject(Router);
  private registroService = inject(RegistroService);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.estatus = Number(params['estatus']);
      const cfg = ETAPAS[this.estatus];
      this.titulo    = cfg?.titulo    ?? 'Solicitudes';
      this.rutaEditar = cfg?.rutaEditar ?? '/solicitud';
      this.cargar();
    });
  }

  cargar(): void {
    this.loading = true;
    this.registroService.getSolicitudesCola(this.estatus).subscribe({
      next: (resp: any) => {
        const data = resp?.data ?? [];
        this.originalData = Array.isArray(data) ? [...data] : [];
        this.temp = [...this.originalData];
        this.filteredCount = this.temp.length;
        this.setPage({ offset: 0 });
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  setPage(info: any): void {
    this.page = info.offset;
    const start = this.page * this.pageSize;
    this.rows = this.temp.slice(start, start + this.pageSize);
  }

  updateFilter(event: any): void {
    const val = (event.target?.value ?? '').toLowerCase();
    this.temp = this.originalData.filter(row =>
      Object.values(row).some(f => f && f.toString().toLowerCase().includes(val))
    );
    this.filteredCount = this.temp.length;
    this.setPage({ offset: 0 });
  }

  onSort(event: any): void {
    const { prop, dir } = event.sorts[0];
    this.temp = [...this.temp].sort((a, b) => {
      const va = a[prop] ?? '';
      const vb = b[prop] ?? '';
      if (typeof va === 'string') return dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      return dir === 'asc' ? va - vb : vb - va;
    });
    this.setPage({ offset: 0 });
  }

  navegar(id: number): void {
    const idNum = parseInt(String(id), 10);
    if (!isNaN(idNum) && idNum > 0) {
      this.router.navigate([this.rutaEditar, idNum]);
    }
  }

  getOrigenNombre(id: number): string {
    switch (Number(id)) {
      case 1: return 'Estatal';
      case 2: return 'Federal';
      case 3: return 'Fideicomiso';
      case 4: return 'Concurrente o Propio';
      default: return '—';
    }
  }

  exportToExcel(): void {
    const ws = XLSX.utils.json_to_sheet(this.temp.map((r, i) => ({
      'N°': i + 1,
      'Folio': r.folio ?? '',
      'Fecha ingreso': r.fecha_ingreso ?? '',
      'Tipo solicitud': r.tipo_solicitud ?? '',
      'Dependencia': r.dependencia_nombre ?? r.id_dependencia ?? '',
      'Estatus': r.estatus_id ?? '',
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Solicitudes');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${this.titulo}.xlsx`);
  }
}
