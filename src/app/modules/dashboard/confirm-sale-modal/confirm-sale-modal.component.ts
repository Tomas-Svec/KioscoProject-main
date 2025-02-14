import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-confirm-sale-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule, // Necesario si usas MatDialog
  ],
  templateUrl: './confirm-sale-modal.component.html',
  styleUrl: './confirm-sale-modal.component.css'
})
export class ConfirmSaleModalComponent {
  @Input() saleData: { items: any[], total: number, user: any, date: Date } = {
    items: [],
    total: 0,
    user: null,
    date: new Date()
  };
  @Output() confirmSale = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<ConfirmSaleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.saleData = data; // Asigna los datos recibidos a saleData
  }
}
