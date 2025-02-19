import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { CompleteSaleDto } from './CompleteSaleDto';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //private apiUrl = 'https://localhost:7262';
  private apiUrl = 'https://kiosco.somee.com';

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
    orderBy: string = "FechaVenta",
    sortOrder: string = "asc", // Añadido el parámetro sortOrder
    userId?: number,
    userName?: string,
    productName?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set("pageNumber", pageNumber.toString())
      .set("pageSize", pageSize.toString())
      .set("orderBy", orderBy)
      .set("sortOrder", sortOrder); // Usamos el argumento sortOrder aquí
  
    if (minTotal !== undefined) {
      params = params.set("minTotal", minTotal.toString());
    }
  
    if (maxTotal !== undefined) {
      params = params.set("maxTotal", maxTotal.toString());
    }
  
    if (userId !== undefined) {
      params = params.set("userId", userId.toString());
    }
  
    if (userName) {
      params = params.set("userName", userName);
    }
  
    if (productName) {
      params = params.set("productName", productName);
    }
  
    // Imprime los parámetros para depuración
    console.log('Parámetros enviados:', params);
  
    return this.http.get(`${this.apiUrl}/api/sales`, { params }).pipe(
      catchError((error) => {
        console.error("Error al obtener ventas:", error);
        return of(null); // Retornar un valor nulo en caso de error
      })
    );
  }
  
  
  submitSale(saleData: any): Observable<any> {
    return this.http.post(`/api/sales`, saleData);
  }


}