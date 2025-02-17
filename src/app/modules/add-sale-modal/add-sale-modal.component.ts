import { Component, EventEmitter, Output, Inject, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-sale-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule],
  templateUrl: './add-sale-modal.component.html',
  styleUrl: './add-sale-modal.component.css',
})
export class AddSaleModalComponent implements OnInit {
  
  @Output() productAdded = new EventEmitter<any>(); // Emitir eventos cuando se agrega un producto

  saleForm!: FormGroup;
  paymentMethods = ['Efectivo', 'Transferencia', 'Tarjeta']; // Métodos de pago disponibles
  productos: any[] = [];
  filteredProducts: any[] = [];
  searchTerm: string = '';
  pageSize = 10; // Número de productos por página
  currentPage = 1; // Página actual


  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<AddSaleModalComponent>
  ) {}


  ngOnInit(): void {
    this.saleForm = this.fb.group({
      totalAmount: ['', Validators.required],
      paymentMethod: ['', Validators.required],  // Campo para seleccionar el método de pago
      // Otros campos de la venta
    });

    this.loadProducts(); // Cargar productos
  }
// Cargar productos desde el backend
  loadProducts(): void {
    this.apiService.getProducts().subscribe(
      (data: any[]) => {
        this.productos = data;  // Almacena los productos en el array
        console.log('Productos cargados:', this.productos);  // Verifica que los datos estén llegando
        this.filterProducts();  // Filtra los productos después de cargarlos
      },
      (error) => {
        console.error('Error al cargar productos:', error);  // Manejo de errores
      }
    );
  }

  submitSale(): void {
    if (this.saleForm.valid) {
      const saleData = this.saleForm.value;

      // Asignar el medio de pago al objeto saleData
      saleData.MedioPago = saleData.paymentMethod;  // Asegurarse que 'paymentMethod' se mapee a 'MedioPago'

      this.apiService.submitSale(saleData).subscribe(response => {
        console.log('Venta registrada', response);
        // Aquí podrías agregar lógica para mostrar un mensaje de éxito o redirigir
      });
    }
  }

  
  
  


  // Filtrar productos por término de búsqueda
  filterProducts(): void {
    if (this.searchTerm.trim() !== '') {
      this.filteredProducts = this.productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredProducts = this.productos;  // Mostrar todos si no hay búsqueda
    }
    console.log('Productos filtrados:', this.filteredProducts);  // Verifica el filtrado
  }

  //Obtener productos paginados
  get paginatedProducts(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredProducts.slice(start, end);
  }

  // Total de páginas
  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  // Ir a la página anterior
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Ir a la página siguiente
  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Agregar producto al carrito
  addToCart(product: any): void {
    console.log('Producto agregado:', product);
    this.dialogRef.close({ ...product, cantidad: 1 }); // Devuelve el producto al cerrar el modal
  }

  // Cerrar el modal sin devolver nada
  closeModal(): void {
    this.dialogRef.close();
  }

  
}
