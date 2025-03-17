import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { RouteNavigatorService } from '../../../core/services/route-navigator.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manage-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './manage-stock.component.html',
  styleUrls: ['./manage-stock.component.css']
})
export class ManageStockComponent implements OnInit {
  @ViewChild('formularioEdicion') formularioEdicion!: ElementRef;
  @ViewChild('form') form!: NgForm; // Referencia fuerte al formulario

  productos: any[] = [];
  categorias: any[] = [];
  filterCategories: any[] = [];
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
    private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<ManageStockComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts(); // Cargar productos
    this.loadCategories(); // Cargar categorías
    this.loadFilteredCategories(); // Cargar categorías filtradas
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

  // Método para cargar categorías filtradas (excluyendo "Sin categoría")
  loadFilteredCategories(): void {
    this.apiService.getCategories().subscribe(
      (data) => {
        this.filterCategories = data.filter((categoria) => categoria.id !== 1); // Filtrar "Sin categoría"
        this.cdr.detectChanges(); // Forzar detección de cambios
        console.log('Categorías filtradas cargadas:', this.filterCategories);
      },
      (error) => {
        console.error('Error al cargar categorías filtradas:', error);
      }
    );
  }

  // Cargar categorías desde el backend
  loadCategories(): void {
    this.apiService.getCategories().subscribe(
      (data) => {
        this.categorias = data; // Almacena las categorías en el array
        this.cdr.detectChanges(); // Forzar detección de cambios
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


  // Función para cerrar el modal
  closeModal(): void {
    this.dialogRef.close();
  }

  // Abrir el modal de categorías
  openCategoryModal(): void {
    this.loadCategories(); // Recargar categorías antes de abrir el modal
  this.loadFilteredCategories(); // Recargar categorías filtradas
  this.showCategoryModal = true; // Mostrar el modal
  this.currentCategory = {}; // Limpiar la categoría actual
  }

  // Cerrar el modal de categorías
  closeCategoryModal(): void {
    this.showCategoryModal = false; // Cierra el modal de categorías
    this.currentCategory = {}; // Limpiar los datos de la categoría
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

  saveCategory(): void {
    if (this.currentCategory.id) {
      // Actualizar una categoría existente
      this.apiService.updateCategory(this.currentCategory.id, this.currentCategory).subscribe(
        () => {
          this.loadCategories(); // Recargar categorías
          this.closeCategoryModal(); // Cerrar el modal
          console.log('Categoría actualizada correctamente.');
        },
        (error) => {
          console.error('Error al actualizar categoría:', error);
          alert('Hubo un error al actualizar la categoría.');
        }
      );
    } else {
      // Crear una nueva categoría
      this.apiService.createCategory(this.currentCategory).subscribe(
        () => {
          this.loadCategories(); // Recargar categorías
          this.closeCategoryModal(); // Cerrar el modal
          console.log('Categoría creada correctamente.');
        },
        (error) => {
          console.error('Error al crear categoría:', error);
          alert('Hubo un error al crear la categoría.');
        }
      );
    }
  }

  // Editar un producto
  editProduct(product: any): void {
    this.selectedProduct = { ...product }; // Copiar los datos del producto seleccionado
    console.log('Producto seleccionado para edición:', this.selectedProduct);
    
    // Desplazar la pantalla hacia el formulario de edición
    this.scrollToForm();
  }

  // Método para desplazar la pantalla al formulario de edición
  scrollToForm(): void {
    if (this.formularioEdicion && this.formularioEdicion.nativeElement) {
      this.formularioEdicion.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
    const defaultCategoryId = 1;
  
    if (id === defaultCategoryId) {
      alert('No se puede eliminar la categoría "Sin categoría".');
      return;
    }
  
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.apiService.deleteCategory(id).subscribe(
        () => {
          // Recargar las categorías después de eliminar
          this.loadCategories();
          this.closeCategoryModal(); // Cerrar el modal
          console.log('Categoría eliminada correctamente.');
        },
        (error) => {
          console.error('Error al eliminar categoría:', error);
          alert('Hubo un error al eliminar la categoría.');
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
    if (!this.selectedProduct.nombre || !this.selectedProduct.precio || this.selectedProduct.stock == null || !this.selectedProduct.categoriaId){
        this.snackBar.open('Por favor, completa todos los campos obligatorios.', 'Cerrar', { duration: 3000 });
        return;
    }

    // Validar que el precio sea mayor que 0
    if (this.selectedProduct.precio <= 0) {
        this.snackBar.open('El precio debe ser mayor que 0.', 'Cerrar', { duration: 3000 });
        return;
    }

    // Verificar si ya existe un producto con los mismos datos
    const existingProduct = this.productos.find((p) =>
        p.nombre === this.selectedProduct.nombre &&
        p.descripcion === this.selectedProduct.descripcion &&
        p.precio === this.selectedProduct.precio &&
        p.stock === this.selectedProduct.stock &&
        p.categoriaId === this.selectedProduct.categoriaId
    );

    if (existingProduct) {
        this.snackBar.open('Ya existe un producto con los mismos datos.', 'Cerrar', { duration: 3000 });
        return;
    }

    // Crear o actualizar el producto
    if (this.selectedProduct.id) {
        this.apiService.updateProduct(this.selectedProduct.id, this.selectedProduct).subscribe(
            () => {
                this.snackBar.open('Producto actualizado correctamente.', 'Cerrar', { duration: 3000 });
                this.loadProducts();
                this.selectedProduct = {};
            },
            (error) => {
                console.error('Error al actualizar producto:', error);
                this.snackBar.open('Hubo un error al actualizar el producto.', 'Cerrar', { duration: 3000 });
            }
        );
    } else {
        this.apiService.createProduct(this.selectedProduct).subscribe(
            () => {
                this.snackBar.open('Producto creado correctamente.', 'Cerrar', { duration: 3000 });
                this.loadProducts();
                this.selectedProduct = {};
            },
            (error) => {
                console.error('Error al crear producto:', error);
                this.snackBar.open('Hubo un error al crear el producto. Ya existe uno con el mismo nombre', 'Cerrar', { duration: 3000 });
            }
        );
    }
  }
}
