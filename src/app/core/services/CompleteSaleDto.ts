export interface CompleteSaleDto {
    EmpleadoId: number;
    Total: number;
    Descuento: number;
    Detalles: SaleDetailDto[];
  }
  
  export interface SaleDetailDto {
    ProductoId: number;
    Cantidad: number;
    PrecioUnitario: number;
  }