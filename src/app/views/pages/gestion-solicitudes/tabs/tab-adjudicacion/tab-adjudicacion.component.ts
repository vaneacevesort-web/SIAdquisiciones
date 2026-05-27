import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab-adjudicacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab-adjudicacion.component.html',
})
export class TabAdjudicacionComponent {

  @Input() idSolicitud!: number;
  @Input() readonly = true;
  @Output() saved = new EventEmitter<void>();

}
