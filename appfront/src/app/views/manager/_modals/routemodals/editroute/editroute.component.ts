import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { DOCUMENT, NgStyle } from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarComponent, ModalModule, ButtonCloseDirective,
          ButtonGroupComponent,
          CardFooterComponent,
          FormCheckLabelDirective,
          GutterDirective,
          ProgressBarDirective,
          ProgressComponent,
          TableDirective, FormLabelDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, ColDirective,
          CardHeaderComponent, ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
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
    selector: 'app-editroutemodal',
    templateUrl: './editroute.component.html',
    styleUrls: ['./editroute.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, ChartjsComponent, AvatarComponent, NgStyle,
      ButtonGroupComponent, RouterLink, ModalModule, ButtonCloseDirective,
      CardFooterComponent,
      FormCheckLabelDirective,
      GutterDirective,
      ProgressBarDirective,
      ProgressComponent,
      TableDirective,
      FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, FormLabelDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, ColDirective,
      CardHeaderComponent, ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective]
})
export class EditRouteModalComponent implements AfterViewInit {

  private map!: L.Map;

  public routeId: any;
  public visible: boolean = false;
  public oldStops: any = "";
  public newStops: any = "";

  display: boolean = false;
  @Output() visibilityChange = new EventEmitter<boolean>();

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

  private markersLayer = new L.LayerGroup();

  public initMap(): void {
    this.map = L.map('mapedit', {
      center: [ 1.344365, 103.694433 ],
      zoom: 15
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 15,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    setTimeout(function () {
       window.dispatchEvent(new Event("resize"));
    }, 500);
  }

  constructor() {

  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
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

  public setBusStopConfirmationPopup(oldStops:string, newStops:string):void {
    this.oldStops = oldStops;
    this.newStops = newStops;
    this.display = true;
  }

  handleVisibilityChange(event: any) {
    this.visible = event;
    // setTimeout(() => {
    //   if (this.visible == false) {
    //       console.log('HIDDEN');
    //   } else {
    //       console.log('VISIBLE');
    //
    //       this.initMap();
    //
    //       for(var i=0; i < this.routes.length; i++) {
    //         if(this.routes[i].routeId == this.routeId)
    //         {
    //           console.log(this.routes[i].stopsList);
    //           (<HTMLInputElement>document.getElementById("inputBusServices")).value = this.routes[i].serviceNumber;
    //           (<HTMLInputElement>document.getElementById("oldBusStops")).value = this.routes[i].stopsList.toString();
    //           (<HTMLInputElement>document.getElementById("inputBusStops")).value = this.routes[i].stopsList.toString();
    //           this.inputStopsMap(this.routes[i].stopsList.toString());
    //         }
    //       }
    //   }
    // }, 1000)

  }

  toggleVisibility() {
    if(!this.visible) {this.initMap();}
    this.visible = !this.visible;
  }

  clickClose() {
    this.map.off();
    this.map.remove();
    (<HTMLFormElement>document.getElementById("editRouteForm")).reset();
    this.visible = false;
  }

}
