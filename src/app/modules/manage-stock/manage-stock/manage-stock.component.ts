import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { RouteNavigatorService } from '../../../core/services/route-navigator.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-manage-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-stock.component.html',
  styleUrls: ['./manage-stock.component.css']
})
export class ManageStockComponent implements OnInit {
  
  @ViewChild('form') form!: NgForm; // Referencia fuerte al formulario

  productos: any[] = [];
  categorias: any[] = [];
  selectedProduct: any = {};
  proveedores: any[] = [];
  showCategoryModal = false; // Controla la visibilidad del modal de categorías
  showProductForm = false; // Controla la visibilidad del formulario de productos
  currentCategory: any = {}; // Objeto para almacenar los datos de la categoría actual
  showModal = false; // Controla la visibilidad del modal general

  // Propiedades para el filtro y búsqueda
  selectedCategory: number | null = null; // ID de la categoría seleccionada
  searchTerm: string = ''; // Término de búsqueda por nombre

  // Propiedades para paginación
  pageSize = 10; // Número de productos por página
  currentPage = 1; // Página actual

  constructor(
    private apiService: ApiService,
    private routeNavigator: RouteNavigatorService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts(); // Cargar productos
    this.loadCategories(); // Cargar categorías
  }

  // Método para cargar productos desde el backend
  loadProducts(): void {
    this.apiService.getProducts().subscribe(
      (data: any[]) => {
        this.productos = data; // Almacena los productos en el array
        console.log('Productos cargados:', this.productos);
      },
      (error) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }

  // Cargar categorías desde el backend
  loadCategories(): void {
    this.apiService.getCategories().subscribe(
      (data) => {
        this.categorias = data; // Almacena las categorías en el array
        console.log('Categorías cargadas:', this.categorias);
      },
      (error) => {
        console.error('Error al cargar categorías:', error);
      }
    );
  }

  // Lógica para abrir y cerrar el modal general
  openModal() {
    this.showModal = true; // Abre el modal
  }

  closeModal() {
    this.showModal = false; // Cierra el modal
  }

  // Abrir el modal de categorías
  openCategoryModal(): void {
    this.showCategoryModal = true; // Muestra el modal de categorías
    this.currentCategory = {}; // Limpiar la categoría actual
  }

  // Cerrar el modal de categorías
  closeCategoryModal(): void {
    this.showCategoryModal = false; // Cierra el modal de categorías
    this.currentCategory = {}; // Limpiar los datos de la categoría
  }

  // Guardar una nueva categoría o actualizar una existente
  saveCategory(): void {
    if (this.currentCategory.id) {
      this.apiService.updateCategory(this.currentCategory.id, this.currentCategory).subscribe(
        () => {
          this.loadCategories(); // Recargar categorías
          this.closeCategoryModal(); // Cerrar el modal
        },
        (error) => {
          console.error('Error al actualizar categoría:', error);
        }
      );
    } else {
      this.apiService.createCategory(this.currentCategory).subscribe(
        () => {
          this.loadCategories(); // Recargar categorías
          this.closeCategoryModal(); // Cerrar el modal
        },
        (error) => {
          console.error('Error al crear categoría:', error);
        }
      );
    }
  }

  // Después de cambiar selectedCategory
  onCategoryChange() {
    this.selectedCategory = this.selectedCategory ? parseInt(this.selectedCategory.toString(), 10) : null;
    this.cdr.detectChanges(); // Forzar detección de cambios
  }

  // Editar una categoría
  editCategory(category: any): void {
    this.currentCategory = { ...category }; // Copiar los datos de la categoría seleccionada
  }

  // Editar un producto
  editProduct(product: any): void {
    this.selectedProduct = { ...product }; // Copiar los datos del producto seleccionado
    console.log('Producto seleccionado para edición:', this.selectedProduct);
  }

  // Eliminar un producto
  deleteProduct(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.apiService.deleteProduct(id).subscribe(
        () => {
          this.loadProducts(); // Recargar los productos
        },
        (error) => {
          console.error('Error al eliminar producto:', error);
        }
      );
    }
  }

  // Cancelar la edición de una categoría
  cancelCategoryEdit(): void {
    this.currentCategory = {}; // Limpiar el formulario
  }

  // Eliminar una categoría
  deleteCategory(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.apiService.deleteCategory(id).subscribe(
        () => {
          this.loadCategories(); // Recargar categorías
        },
        (error) => {
          console.error('Error al eliminar categoría:', error);
        }
      );
    }
  }

  // Obtener el nombre de la categoría por ID
  getCategoriaNombre(id: number): string {
    const categoria = this.categorias.find((c) => c.id === id);
    return categoria ? categoria.nombre : 'Sin categoría';
  }

  // Método para obtener los productos filtrados
  get filteredProducts(): any[] {
    let products = this.productos;

    // Filtrar por categoría
    if (this.selectedCategory !== null) {
      products = products.filter((producto) => producto.categoriaId === this.selectedCategory);
    }

    // Filtrar por nombre
    if (this.searchTerm.trim() !== '') {
      products = products.filter((producto) =>
        producto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    return products;
  }

  // Método para obtener los productos paginados
  get paginatedProducts(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredProducts.slice(start, end);
  }

  // Total de páginas
  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  // Ir a la primera página
goToFirstPage(): void {
  this.currentPage = 1;
}

// Ir a la página anterior
goToPreviousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

// Ir a la siguiente página
goToNextPage(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}

// Ir a la última página
goToLastPage(): void {
  this.currentPage = this.totalPages;
}

  // Método para limpiar todos los filtros
  clearFilters(): void {
    this.selectedCategory = null; // Reinicia la categoría seleccionada
    this.searchTerm = ''; // Limpia el término de búsqueda
    console.log('Filtros limpiados');
    this.cdr.detectChanges(); // Forzar detección de cambios
  }

  // Enviar el formulario de producto
  onSubmit(): void {
    // Validar que todos los campos requeridos estén completos
    if (!this.selectedProduct.nombre || !this.selectedProduct.precio || !this.selectedProduct.stock || !this.selectedProduct.categoriaId) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Validar que el precio sea mayor que 0
    if (this.selectedProduct.precio <= 0) {
      alert('El precio debe ser mayor que 0.');
      return;
    }

    // Si el producto tiene un ID, actualízalo; de lo contrario, créalo
    if (this.selectedProduct.id) {
      this.apiService.updateProduct(this.selectedProduct.id, this.selectedProduct).subscribe(
        () => {
          alert('Producto actualizado correctamente.');
          this.loadProducts();
          this.selectedProduct = {};
        },
        (error) => {
          console.error('Error al actualizar producto:', error);
          alert('Hubo un error al actualizar el producto.');
        }
      );
    } else {
      this.apiService.createProduct(this.selectedProduct).subscribe(
        () => {
          alert('Producto creado correctamente.');
          this.loadProducts();
          this.selectedProduct = {};
        },
        (error) => {
          console.error('Error al crear producto:', error);
          alert('Hubo un error al crear el producto.');
        }
      );
    }
  }
}