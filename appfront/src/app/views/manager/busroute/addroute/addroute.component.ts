import { Component, AfterViewInit } from '@angular/core';
import { DOCUMENT, NgStyle } from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AvatarComponent, ModalModule,
          ButtonGroupComponent,
          CardFooterComponent,
          FormCheckLabelDirective,
          GutterDirective,
          ProgressBarDirective,
          ProgressComponent,
          TableDirective, FormLabelDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, ColDirective,
          CardHeaderComponent, ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { DocsExampleComponent } from '@docs-components/public-api';
import * as L from 'leaflet';

interface IBusStop {
  long: number;
  lat: number;
}

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
    selector: 'app-addroute',
    templateUrl: './addroute.component.html',
    styleUrls: ['./addroute.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, ChartjsComponent, DocsExampleComponent, AvatarComponent, NgStyle,
      ButtonGroupComponent, RouterLink, ModalModule,
      CardFooterComponent,
      FormCheckLabelDirective,
      GutterDirective,
      ProgressBarDirective,
      ProgressComponent,
      TableDirective,
      FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, FormLabelDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, ColDirective,
      CardHeaderComponent, ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective]
})
export class AddrouteComponent implements AfterViewInit {

  private map!: L.Map;

  private markersLayer = new L.LayerGroup();

  private initMap(): void {
    this.map = L.map('map', {
      center: [ 1.344365, 103.694433 ],
      zoom: 15
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 15,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }

  public inputStopsMap(inputBusStops: string):void {

    var array = inputBusStops.split(',');
    this.markersLayer.clearLayers();

    var busStops: { [code: string]: IBusStop; } = {
      "10000": {lat: 1.347764, long: 103.680274},
      "10001": {lat: 1.347477, long: 103.679489}
    };

    for(var i=0; i < array.length; i++) {
      array[i] = array[i].replace(/^\s*/, "").replace(/\s*$/, "");
      if(busStops[array[i]] != null) {
        const marker = L.marker([busStops[array[i]].lat,busStops[array[i]].long]);
        var num:Number = i+1;
        marker.bindPopup("Bus Stop " + num + "<br>Bus Stop Code: " + array[i]);
        this.markersLayer.addLayer(marker);
      }
    }
    this.markersLayer.addTo(this.map);
  }

}