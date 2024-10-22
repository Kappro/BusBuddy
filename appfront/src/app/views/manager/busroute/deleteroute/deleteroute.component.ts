import { Component, AfterViewInit } from '@angular/core';
import { DOCUMENT, NgStyle } from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AvatarComponent, 
          ButtonGroupComponent,
          CardFooterComponent,
          FormCheckLabelDirective,
          GutterDirective,
          ProgressBarDirective,
          ProgressComponent,
          TableDirective, FormLabelDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, ColDirective,
          CardHeaderComponent, ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective, 
          ModalModule} from '@coreui/angular';
import { DocsExampleComponent } from '@docs-components/public-api';
import * as L from 'leaflet';

interface IBusStop {
  long: number;
  lat: number;
}

interface IRoute {
  routeId: number,
  serviceNumber: string
  stopsList: number[]
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
    selector: 'app-deleteroutes',
    templateUrl: './deleteroute.component.html',
    styleUrls: ['./deleteroute.component.scss'],
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
export class DeleterouteComponent implements AfterViewInit {

  public routes: IRoute[] = [
    {
      routeId: 1,
      serviceNumber: '179',
      stopsList: [10000, 10001, 10002, 10003, 10004]
    },
    {
      routeId: 2,
      serviceNumber: '179a',
      stopsList: [20000, 20001, 20002, 20003, 20004]
    },
    {
      routeId: 3,
      serviceNumber: '179b',
      stopsList: [30000, 30001, 30002, 30003, 30004]
    },
    {
      routeId: 4,
      serviceNumber: '199',
      stopsList: [40000, 40001, 40002, 40003, 40004]
    }
  ];

  private map!: L.Map;

  public routeId:any;

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

  constructor(private _Activatedroute:ActivatedRoute) { }

  ngOnInit() {
    this.routeId = this._Activatedroute.snapshot.paramMap.get("routeId");
  }

  ngAfterViewInit(): void {
    this.initMap();
    for(var i=0; i < this.routes.length; i++) {
      if(this.routes[i].routeId == this.routeId)
      {
        this.inputStopsMap(this.routes[i].stopsList.toString());
      }
    }
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