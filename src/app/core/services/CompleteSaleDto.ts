export interface CompleteSaleDto {
  EmpleadoId: number;
  Total: number;
  Descuento: number;
  MedioPago: string; // Agregar esta propiedad
  Detalles: SaleDetailDto[];
}

export interface SaleDetailDto {
  ProductoId: number;
  Cantidad: number;
  PrecioUnitario: number;
}