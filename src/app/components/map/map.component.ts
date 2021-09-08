import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { Categoria } from 'src/app/models/categoria';
import { Mapa } from 'src/app/models/mapa';
import { MapaService } from 'src/app/services/mapa.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [MapaService]
})
export class MapComponent implements AfterViewInit {
  private map?: L.Map;
  private popup?: L.Popup;
  protected onClickHandler: any;
  constructor(private serv: MapaService) {

  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.onObtenerMapa();
    }, 10);
  }
  private onObtenerMapa(): void {
    this.serv.obtenerMapa().subscribe({
      next: (result) => {
        this.initMap(result);
      },
      error: (e) => {

      }
    });
  }
  private onListarCategorias(): void {
    this.serv.listarCategorias().subscribe({
      next: (result) => {
        if(this.map){
          new LeyendaMap('', result).addTo(this.map);
        }
        
      },
      error: (e) => {

      }
    });
  }
  private initMap(mapa: Mapa): void {
    this.map = L.map('map', {
      center: L.latLng(mapa.lat, mapa.lng),
      zoom: Number(mapa.zoom)
    });
    this.popup = L.popup({ minWidth: 250 });
    this.onClickHandler = (evt: any) => this.onMapClick(evt);
    this.map.on('click', this.onClickHandler);
    const capa1 = L.tileLayer
      .wms(mapa.urlBase, {
        layers: mapa.lyBase,
        maxZoom: 26,
        attribution: 'TI-GEL <a href="https://www.grupo-lafuente.com">Grupo Lafuente</a>'
      }).addTo(this.map);
    //var randInt = Math.floor(Math.random() * 200000) + 1;
    const capa2 = L.tileLayer
      .wms(mapa.urlLote, {
        layers: mapa.lyLote,
        format: 'image/png',
        transparent: true,
        maxZoom: 26
      }).addTo(this.map);
    this.onListarCategorias();
  }
  onMapClick(evt: any): void {
    this.serv.obtenerLote(evt.latlng.lat, evt.latlng.lng).subscribe({
      next: (result) => {
        if (this.popup && this.map) {
          let html = '<p><b>Ubicación:</b> UI ' + result.uv + ' MZ ' + result.mz + ' LT ' + result.lt + '</p>';
          html = html + '<p><b>Categoria: </b>' + result.categoria + '</p>';
          html = html + '<p><b>Superficie: </b>' + result.superficie.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }) + ' M2 </p>';
          html = html + '<p><b>Cuota inicial: </b>' + result.moneda + ' ' + result.cuotaInicial.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }) + '</p>';
          html = html + '<p><b>Cuota mensual(' + result.maximoPlazo + ' Meses): </b>' + result.moneda + ' ' + result.montoCuota.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }) + '</p>';

          this.popup.setLatLng(evt.latlng)
            .setContent(html)
            .openOn(this.map);
        }

      },
      error: (e) => {

      }
    });
  }

}
export class LeyendaMap extends L.Control {
  constructor(private title: string, private categorias: Categoria[], options?: L.ControlOptions) {
    super(options);
  }
  onAdd?(map: L.Map): HTMLElement {

    let container = L.DomUtil.create('div', 'info legend');
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);
    let title = L.DomUtil.create('span', 'info-title', container);
    let button = L.DomUtil.create('span', 'info-button', container);
    button.innerHTML = '<i class="material-icons">remove_circle</i>';

    title.innerHTML = this.title;
    let content = L.DomUtil.create('div', 'info-content', container);
    let section = L.DomUtil.create('div', 'info-section expended', content);

    let toggle = L.Util.bind(function () {
      if (L.DomUtil.hasClass(section, 'expended')) {
        button.innerHTML = '<i class="material-icons">add_circle</i>';
        L.DomUtil.removeClass(section, 'expended');
      } else {
        L.DomUtil.addClass(section, 'expended');
        button.innerHTML = '<i class="material-icons">remove_circle</i>';
      }
    }, this);


    L.DomEvent.addListener(button, 'click', function () {
      toggle();
    });

    let ul = L.DomUtil.create('ul', '', section);

    for (var i = 0; i < this.categorias.length; i++) {
      ul.innerHTML +=
        '<li><i style="background:' + this.categorias[i].color + '"></i><strong>' +
        this.categorias[i].categoria + '</strong> <small style="font-size:10px;">' + this.categorias[i].descripcion + '</small></li>';
    }

    return container;
  }
}
