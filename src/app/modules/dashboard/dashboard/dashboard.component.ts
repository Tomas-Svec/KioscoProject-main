/* src/app/modules/dashboard/dashboard/dashboard.component.ts */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ManageStockComponent } from "../../manage-stock/manage-stock/manage-stock.component";
import { AddSaleModalComponent } from "../../add-sale-modal/add-sale-modal.component";
import { MatDialog } from '@angular/material/dialog';
import { RouteNavigatorService } from '../../../core/services/route-navigator.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DiscountModalComponent } from '../discount-modal/discount-modal.component';
import { ConfirmSaleModalComponent } from '../confirm-sale-modal/confirm-sale-modal.component';
import { ApiService } from '../../../core/services/api.service';
import { CompleteSaleDto } from '../../../core/services/CompleteSaleDto';
import { SaleDetailsModalComponent } from '../sale-details-modal/sale-details-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [

    AddSaleModalComponent,
    DiscountModalComponent,
    ConfirmSaleModalComponent,
    SaleDetailsModalComponent,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  isDarkMode: boolean = false;
  ventas: any[] = []; // Historial de ventas
  cartItems: any[] = []; // Productos en el carrito
  total: number = 0; // Total de la venta actual
  productos: any[] = []; // Productos en stock
  currentUser: any;
  currentPage: number = 1;
  pageSize: number = 5;
  totalVentas: number = 0; // Esto se puede manejar desde el backend si lo soporta

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private routeNavigator: RouteNavigatorService,
    private breakpointObserver: BreakpointObserver,
    private apiService: ApiService, // Agrega el servicio de API
  private themeService: ThemeService // Agrega el servicio de tema
  ) {}

  ngOnInit(): void {
    // Carga el historial de ventas y otros datos necesarios
    this.loadSalesHistory();
    // Fecha la información del usuario al inicializar el componente
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      console.log('Usuario actual:', this.currentUser); // Verifica que el usuario tenga datos
    });
  }

   // Método para agregar un producto al carrito
   onProductAdded(product: any): void {
    console.log('Producto agregado:', product);
  
    // Verificar si el producto ya existe en el carrito
    const existingItem = this.cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.cantidad += product.cantidad; // Incrementa la cantidad
    } else {
      this.cartItems.push({ ...product, stock: product.stock }); // Agrega el producto con su stock
    }
  
    // Actualizar el total
    this.calculateTotal();
    console.log('Carrito:', this.cartItems);
  }
  
    // Método para calcular el total del carrito
    calculateTotal(): void {
      this.total = this.cartItems.reduce(
        (sum, item) => sum + item.precio * item.cantidad,
        0
      );
    }


  // Método para eliminar un producto del carrito
removeFromCart(item: any): void {
  this.cartItems = this.cartItems.filter((i) => i.id !== item.id);
  this.calculateTotal();
}

// Método para aplicar descuento
applyDiscount(item: any): void {
  const dialogConfig = {
    width: '400px',
    data: item // Pasa el producto seleccionado al modal
  };

  const dialogRef = this.dialog.open(DiscountModalComponent, dialogConfig);

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.applyDiscountToProduct(result.product, result.discount);
    }
  });
}

// Método para aplicar o limpiar el descuento al precio del producto
applyDiscountToProduct(product: any, discount: number | null): void {
  if (discount !== null) {
    // Aplicar descuento
    const originalPrice = product.precioOriginal || product.precio; // Usar el precio original si existe
    const discountAmount = (originalPrice * discount) / 100;
    product.precio = originalPrice - discountAmount;

    // Guardar el precio original si no está guardado
    if (!product.precioOriginal) {
      product.precioOriginal = originalPrice;
    }

    console.log(`Descuento aplicado: ${discount}%`);
    console.log(`Nuevo precio: $${product.precio.toFixed(2)}`);
  } else {
    // Limpiar descuento
    if (product.precioOriginal) {
      product.precio = product.precioOriginal; // Restaurar el precio original
      delete product.precioOriginal; // Eliminar la referencia al precio original
      console.log('Descuento limpiado. Precio restaurado.');
    }
  }

  this.calculateTotal(); // Actualiza el total del carrito
}





   // Cargar historial de ventas
   loadSalesHistory(): void {
    this.apiService.getSales().subscribe(
      (data: any[]) => {
        this.ventas = data;
      },
      (error) => {
        console.error("Error al cargar historial de ventas:", error);
      }
    );
  }

  nextPage(): void {
    this.currentPage++;
    this.loadSalesHistory();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadSalesHistory();
    }
  }

  //Abril modal de detalle de venta:
  openSaleDetails(sale: any): void {
    this.dialog.open(SaleDetailsModalComponent, {
      width: '500px',
      data: sale
    });
  }
  
  

  // Abrir modal de nueva venta
  openNewSaleModal(): void {
    const isMobile = this.breakpointObserver.isMatched('(max-width: 768px)');
    const dialogConfig = {
      width: isMobile ? '95%' : '80%',
      height: isMobile ? '95%' : '80%',
      maxWidth: isMobile ? 'none' : '1200px',
      maxHeight: isMobile ? 'none' : '90vh',
      panelClass: 'custom-dialog-container',
    };
  
    // Abre el modal y escucha los resultados
    const dialogRef = this.dialog.open(AddSaleModalComponent, dialogConfig);
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onProductAdded(result); // Maneja el producto agregado
      }
    });
  }

  
// Método para aumentar la cantidad de un producto con validación de stock
incrementQuantity(item: any): void {
  if (item.cantidad < item.stock) {
    item.cantidad += 1; // Incrementa la cantidad si hay suficiente stock
    this.calculateTotal(); // Actualiza el total
  } else {
    alert('No hay suficiente stock para este producto.');
    console.log('No hay suficiente stock para:', item);
  }
}

// Método para disminuir la cantidad de un producto
decrementQuantity(item: any): void {
  if (item.cantidad > 1) {
    item.cantidad -= 1; // Disminuye la cantidad si es mayor que 1
    this.calculateTotal(); // Actualiza el total
  }
}

  
  //Modal del stock
  openManageStockModal(): void {
    const isMobile = this.breakpointObserver.isMatched('(max-width: 768px)'); // Detecta si es móvil

    const dialogConfig = {
      width: isMobile ? '95%' : '80%', // Ancho para móviles y escritorios
      height: isMobile ? '95%' : '80%', // Altura para móviles y escritorios
      maxWidth: isMobile ? 'none' : '1200px', // Máximo ancho (ninguno para móviles)
      maxHeight: isMobile ? 'none' : '90vh', // Máxima altura (ninguna para móviles)
      panelClass: 'custom-dialog-container', // Clase personalizada
    };

    this.dialog.open(ManageStockComponent, dialogConfig);
  }





  //Modal de venta:
 // Nuevo método para abrir el modal
 openConfirmSaleModal() {
  if (this.cartItems.length === 0) {
    alert('No hay productos en el carrito para confirmar la venta.');
    return;
  }

  const saleData = {
    items: this.cartItems,
    total: this.total,
    user: this.currentUser,
    date: new Date()
  };

  const dialogRef = this.dialog.open(ConfirmSaleModalComponent, {
    width: '800px',
    data: saleData
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('Venta confirmada, actualizando historial:', result);
      this.loadSalesHistory(); // Recargar el historial de ventas
      this.cartItems = [];
      this.total = 0;
    }
  });
}




// Método para finalizar la venta
finalizeSale() {
  const completeSaleDto: CompleteSaleDto = {
    EmpleadoId: this.currentUser?.id || 0,
    Total: this.total,
    Descuento: 0,
    MedioPago: "Efectivo", // O el valor dinámico que prefieras
    Detalles: this.cartItems.map(item => ({
      ProductoId: item.id,
      Cantidad: item.cantidad,
      PrecioUnitario: item.precio
    }))
  };

  console.log("Enviando CompleteSaleDto:", JSON.stringify(completeSaleDto));

  // Llama al backend para procesar la venta
  this.apiService.completeSale(completeSaleDto).subscribe({
    next: (response) => {
      this.ventas.push(response);
      this.updateProductStock();
      this.cartItems = [];
      this.total = 0;
      //this.themeService.showSnackbar('Venta finalizada con éxito!');
    },
    error: (err) => {
      //this.themeService.showSnackbar('Error al procesar la venta. Inténtalo de nuevo.');
      console.error('Error:', err);
    }
  });
}



updateProductStock() {
  this.cartItems.forEach(item => {
    const product = this.productos.find(p => p.id === item.id);
    if (product) {
      product.stock -= item.cantidad;
    }
  });
}

// Validar stock antes de procesar la venta
private validateStock(): boolean {
  return this.cartItems.every(item => {
    const product = this.productos.find(p => p.id === item.id);
    return product && (product.stock >= item.cantidad);
  });
}




  logout(): void {
    this.authService.logout();
    window.location.href = '/auth/login';
  }

  
}

