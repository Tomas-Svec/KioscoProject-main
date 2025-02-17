
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sale-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './sale-details-modal.component.html',
  styleUrl: './sale-details-modal.component.css'
})
export class SaleDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<SaleDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public sale: any
  ) {
    console.log('Sale data received in modal:', this.sale);
    console.log('Sale details:', this.sale?.Detalles); 
  }

  close(): void {
    this.dialogRef.close();
  }
}
