import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompleteSaleDto } from '../../../core/services/CompleteSaleDto';



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
  @Input() saleData: { items: any[], total: number, user: any, date: Date, MedioPago: string } = {
    items: [],
    total: 0,
    user: null,
    date: new Date(),
    MedioPago: 'Efectivo' // Valor por defecto
  };
  @Output() confirmSale = new EventEmitter<any>(); // Emitirá los datos de la venta confirmada

  constructor(
    public dialogRef: MatDialogRef<ConfirmSaleModalComponent>,
    private apiService: ApiService,
    private snackBar: MatSnackBar, // Para mostrar mensajes
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.saleData = data;
    console.log('Datos recibidos en el modal:', this.saleData);
  }

  confirmarVenta() {
    // Construye el DTO para la venta
    const saleDto: CompleteSaleDto = {
      EmpleadoId: this.saleData.user?.id,
      Total: parseFloat(this.saleData.total.toFixed(2)), // Asegura que sea un número
      Descuento: 0,
      MedioPago: this.saleData.MedioPago || 'Efectivo',
      Detalles: this.saleData.items.map(item => ({
        ProductoId: item.id,
        Cantidad: parseInt(item.cantidad, 10), // Asegura que sea un número entero
        PrecioUnitario: parseFloat(item.precio.toFixed(2)) // Asegura que sea un número
      }))
    };
  
    // Valida los datos antes de enviar
    const isValidSale = saleDto.Detalles.every(detail => 
      !isNaN(detail.Cantidad) && !isNaN(detail.PrecioUnitario)
    );
  
    if (!isValidSale) {
      console.error('Los detalles de la venta contienen valores no numéricos.');
      this.snackBar.open('Error: Los detalles de la venta contienen valores no numéricos.', 'Cerrar', { duration: 3000 });
      return;
    }
  
    // Loguea el JSON enviado
    console.log('Enviando CompleteSaleDto:', JSON.stringify(saleDto, null, 2));
  
    // Envía la solicitud al backend
    this.apiService.completeSale(saleDto).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.snackBar.open('Venta registrada con éxito!', 'Cerrar', { duration: 3000 });
        this.confirmSale.emit(response);
        this.dialogRef.close(response);
      },
      error: (err) => {
        console.error('Error al registrar la venta:', err);
  
        // Verifica si la respuesta es texto plano
        if (err.error instanceof ProgressEvent) {
          console.error('La respuesta del servidor no es JSON válido.');
        } else {
          console.error('Detalles del error:', err.error);
        }
  
        this.snackBar.open('Error al registrar la venta.', 'Cerrar', { duration: 3000 });
      }
    });
  }
  
}

