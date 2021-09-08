import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Mapa } from '../models/mapa';
import { Lote } from '../models/lote';
import { Categoria } from '../models/categoria';

@Injectable()
export class MapaService {

  constructor(public http: HttpClient) { }


  //{apiurl}/sd/mapas/000000000000000000702
  obtenerMapa() {
    return this.http.get<Mapa>(environment.apiurl + '/sd/mapas/' + environment.matnr, { headers: environment.headers });
  }

  //{apiurl}/sd/lotes/000000000000000141/por-ubicacion?latitud=-17.600007297041355&longitud=-63.07866280167252
  obtenerLote(lat: number, lng: number) {
    let myParams = { latitud: lat, longitud: lng };
    return this.http.get<Lote>(environment.apiurl + '/sd/lotes/' + environment.matnr + "/por-ubicacion", { headers: environment.headers, params: myParams });
  }

  //{apiurl}/sd/proyectos/501/categorias
  listarCategorias() {
    return this.http.get<Categoria[]>(environment.apiurl + '/sd/proyectos/' + environment.matnr + '/categorias', { headers: environment.headers });
  }
}
