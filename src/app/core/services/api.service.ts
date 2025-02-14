import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
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
    return this.http.post(`${this.apiUrl}/api/sales/complete-sale`, saleDto);
  }


}