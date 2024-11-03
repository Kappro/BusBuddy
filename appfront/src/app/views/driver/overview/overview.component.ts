import { DOCUMENT, NgStyle } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {
  AvatarComponent,
  ContainerComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  FormLabelDirective,
  FormSelectDirective,
  FormCheckComponent,
  FormCheckInputDirective,
  ColDirective,
  WidgetStatBComponent,
  ProgressBarComponent,
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import * as L from 'leaflet';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../services/api.service";
import {AuthService} from "../../../services/auth.service";

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

// Temp interface to see frontend.
interface IDeployment {
  driver_id: Number,
  bus_license_plate: String,
  datetime_start: /*Date*/ String,
  datetime_end: /*Date*/ String,
  current_status: String,
  status_log: String,
  uid: Number
}

interface IBus {
  service_number: string,
  capacity: Number,
  current_load: string,
  current_status: string,
  license_plate: string,
  status_log: string
}

interface IBusStop {
  long: number;
  lat: number;
}

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss'],
    standalone: true,
    imports: [RouterLink, ReactiveFormsModule, ChartjsComponent, IconDirective, AvatarComponent, NgStyle,
      ButtonDirective,
      ButtonGroupComponent,
      ContainerComponent,
      CardBodyComponent,
      CardComponent,
      CardFooterComponent,
      CardHeaderComponent,
      ColComponent,
      FormCheckLabelDirective,
      GutterDirective,
      ProgressBarDirective,
      ProgressComponent,
      RowComponent,
      TableDirective,
      TextColorDirective,
      FormDirective,
      InputGroupComponent,
      InputGroupTextDirective,
      FormControlDirective,
      FormLabelDirective,
      FormSelectDirective,
      FormCheckComponent,
      FormCheckInputDirective,
      ColDirective,
      WidgetStatBComponent,
      ProgressBarComponent
    ]
})
export class OverviewComponent implements OnInit {

    deployment: any;
    exampleBus:IBus | undefined;
    detailsBusService:String = '';
    detailsBusLicensePlate:String = '';
    detailsBusCurrentStatus:String = '';
    startedDrive:boolean = false;

    private map!: L.Map;
    private markersLayer = new L.LayerGroup();

    public initMap(): void {
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

    constructor(private http: HttpClient,
                private api: ApiService,
                private auth: AuthService,
                private router: Router) {
      this.auth.retrieveIdentity().then(account => {
        const params = {uid: account.uid};
        this.http.post<any>(this.api.API_URL + "/drivers/get_current_deployment", params).subscribe({
          next: (message) => {
            this.deployment = message;
            console.log(message);
          },
          error: (e) => {
            console.log(e);
          }
        });
      });
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

    ngOnInit(): void {

      // Sample example data. To be replaced with actual deployments.
      this.deployment = {
        driver_id: 1,
        bus_license_plate: 'BB1234A',
        datetime_start: '',
        datetime_end: '',
        current_status: 'BufferTime',
        status_log: '',
        uid: 99
      }

      this.exampleBus = {
        service_number: '179T',
        capacity: 99,
        current_load: 'Low',
        current_status: 'InDepot',
        license_plate: 'BB1234A',
        status_log: ''
      }

      this.detailsBusLicensePlate = this.deployment.bus_license_plate;
      if(this.exampleBus.license_plate == this.detailsBusLicensePlate) {
        this.detailsBusService = this.exampleBus.service_number;
        this.detailsBusCurrentStatus = this.exampleBus.current_status;
      }
    }

    ngAfterViewInit(): void {
      this.initMap();
      this.inputStopsMap("10000,10001");
    }

    startDriveBtn():void {
      //window.location.reload();
      if(!this.startedDrive)
      {
        if(this.exampleBus)
        {
          this.exampleBus.current_status = "onRoute";
          (<HTMLInputElement>document.getElementById("curStatus")).value = this.exampleBus.current_status;
          document.getElementById("startDriveInfo")!.innerHTML = "Deployment is now ongoing. Press the 'End Drive' button once you reach the end of the route.";
          document.getElementById("startDriveBtn")!.innerHTML = "End Drive"
          this.startedDrive = true;
        }
      }
      else
      {
        if(this.exampleBus)
        {
          this.exampleBus.current_status = "completed";
          (<HTMLInputElement>document.getElementById("curStatus")).value = this.exampleBus.current_status;
          document.getElementById("startDriveInfo")!.innerHTML = "Deployment is now completed. You are now on standby for your next shift.";
          document.getElementById("startDriveBtn")!.innerHTML = "Drive completed";
          (<HTMLButtonElement>document.getElementById("startDriveBtn")).disabled = true;
          this.startedDrive = true;
        }
      }
    }
}
