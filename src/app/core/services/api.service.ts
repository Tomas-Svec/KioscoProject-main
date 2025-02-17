import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { CompleteSaleDto } from './CompleteSaleDto';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://localhost:7262';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService
  ) { }

  // Obtener todos los productos
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/Products`);
  }

  // Crear un nuevo producto
  createProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/Products`, product);
  }

  // Actualizar un producto existente
  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/Products/${id}`, product);
  }

  // Eliminar un producto
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/Products/${id}`);
  }

  // Obtener todas las categorías
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/Categories`);
  }

  // Crear una nueva categoría
  createCategory(category: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/Categories`, category);
  }

  // Actualizar una categoría
  updateCategory(id: number, category: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/Categories/${id}`, category);
  }

  // Eliminar una categoría
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/Categories/${id}`);
  }


  completeSale(saleDto: CompleteSaleDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/Sales/Completesale`, saleDto);
  }
  
  // Obtener todas las ventas
  getSales(
    pageNumber: number = 1,
    pageSize: number = 5,
    minTotal?: number,
    maxTotal?: number,
    orderBy: string = "FechaVenta"
  ): Observable<any[]> {
    let params = new HttpParams()
      .set("pageNumber", pageNumber.toString())
      .set("pageSize", pageSize.toString())
      .set("orderBy", orderBy);
  
    if (minTotal !== undefined) {
      params = params.set("minTotal", minTotal.toString());
    }
  
    if (maxTotal !== undefined) {
      params = params.set("maxTotal", maxTotal.toString());
    }
  
    return this.http.get<any[]>(`${this.apiUrl}/api/sales`, { params }).pipe(
      tap(response => {
        console.log("Ventas con detalles recibidas:", response); // 🔍 Verificar si llegan los detalles
        if (response?.length > 0) {
          response.forEach(sale => {
            console.log("Detalles de la venta:", sale.Detalles);
          });
        }
      }),
      catchError(error => {
        console.error("Error al obtener ventas:", error);
        return of([]); // Retornar un array vacío en caso de error
      })
    );
  }
  
  submitSale(saleData: any): Observable<any> {
    return this.http.post(`/api/sales`, saleData);
  }


}