import { Component, EventEmitter, Output, Inject } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-add-sale-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule],
  templateUrl: './add-sale-modal.component.html',
  styleUrl: './add-sale-modal.component.css',
})
export class AddSaleModalComponent {
  @Output() productAdded = new EventEmitter<any>(); // Emitir eventos cuando se agrega un producto

  products: any[] = [];
  filteredProducts: any[] = [];
  searchTerm: string = '';
  pageSize = 10; // Número de productos por página
  currentPage = 1; // Página actual


  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<AddSaleModalComponent>
  ) {}


  ngOnInit(): void {
    this.loadProducts(); // Cargar productos al inicializar
  }


  // Cargar productos desde el backend
  loadProducts(): void {
    this.apiService.getProducts().subscribe(
      (data: any[]) => {
        this.products = data;
        this.filteredProducts = this.products; // Inicializar productos filtrados
      },
      (error) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }


  // Filtrar productos por término de búsqueda
  filterProducts(): void {
    if (this.searchTerm.trim() !== '') {
      this.filteredProducts = this.products.filter((producto) =>
        producto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredProducts = this.products; // Mostrar todos si no hay búsqueda
    }
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
