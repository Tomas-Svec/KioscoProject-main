import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() type: 'primary' | 'secondary' = 'primary'; // Tipo de botón
  @Input() disabled: boolean = false; // Estado deshabilitado
  @Input() fullWidth: boolean = false; // Ancho completo
}