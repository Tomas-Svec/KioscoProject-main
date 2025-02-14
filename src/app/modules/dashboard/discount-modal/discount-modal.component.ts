import { Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-discount-modal',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './discount-modal.component.html',
  styleUrl: './discount-modal.component.css'
})
export class DiscountModalComponent {
  discountPercentage: number = 0; // Porcentaje de descuento
  errorMessage: string = ''; // Mensaje de error

  constructor(
    public dialogRef: MatDialogRef<DiscountModalComponent>,
    @Inject(MAT_DIALOG_DATA) public product: any // Producto seleccionado
  ) {}


  // Aplicar el descuento y cerrar el modal
  applyDiscountPercentage(): void {
    if (this.discountPercentage >= 1 && this.discountPercentage <= 100) {
      this.dialogRef.close({ product: this.product, discount: this.discountPercentage });
    } else {
      this.errorMessage = 'Por favor, ingresa un porcentaje válido entre 1 y 100.';
    }
  }

  // Limpiar el descuento
  clearDiscount(): void {
    this.dialogRef.close({ product: this.product, discount: null }); // Devuelve null para indicar que se limpia el descuento
  }

  // Cerrar el modal sin aplicar cambios
  closeModal(event?: Event): void {
    if (event) {
      event.stopPropagation(); // Evitar propagación del clic
    }
    this.dialogRef.close();
  }

}
