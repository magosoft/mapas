export class Mapa {
    constructor(
        public urlBase: string,
        public urlLote: string,
        public lng: number,
        public matnr: string,
        public lyLote: string,
        public zoom: string,
        public lyBase: string,
        public lat: number
    ) { }
}
