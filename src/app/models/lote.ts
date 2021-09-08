export class Lote {
    constructor(
        public proyecto: number,
        public uv: string ,
        public mz: string,
        public lt: string ,
        public lote: string ,
        public superficie: number,
        public ventaM2: number,
        public categoria: string ,
        public precioLista: number,
        public moneda: string ,
        public descuento: number,
        public totalPp: number,
        public montoCuota: number,
        public nuevoPrecioVenta: number,
        public precioListaAjuste: number,
        public maximoDia: number,
        public nuevoTotalPp: number,
        public maximoPlazo: number,
        public cuotaInicial: number,
        public porcentaje: number
      ) { }
}
