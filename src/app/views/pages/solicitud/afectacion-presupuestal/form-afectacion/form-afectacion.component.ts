import { Component,OnInit,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroService } from '../../../../../service/registro.service';

@Component({
  selector: 'app-form-afectacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-afectacion.component.html',
  styleUrl: './form-afectacion.component.scss'
})
export class FormAfectacionComponent implements OnInit {

  paso: number = 1;

  fuentesFinanciamiento: any[] = [];

  private registroService = inject(RegistroService);

  ngOnInit(): void {
    this.cargarFuentesFinanciamiento();
  }

  cargarFuentesFinanciamiento(): void {
    this.registroService.getFuentesFinanciamiento().subscribe({
      next: (resp: any) => {
        this.fuentesFinanciamiento = resp.data || [];
      },
      error: (error) => {
        console.error('ERROR FUENTES FINANCIAMIENTO =>', error);
      }
    });
  }

}