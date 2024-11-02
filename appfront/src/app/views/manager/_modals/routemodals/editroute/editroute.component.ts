import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import {DOCUMENT, NgIf, NgStyle} from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import {RouterLink, ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../../../services/api.service";

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
    CardHeaderComponent, ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgIf]
})
export class EditRouteModalComponent implements AfterViewInit {

  private map!: L.Map;

  public serviceNumber: string = "";
  public visible: boolean = false;
  public currentStops: any[] = [];
  public oldStops: any[] = [];
  public availableStops: any[] = [];
  public valid: boolean = false;
  public editRouteForm: FormGroup;
  public invalid: any[] = [];

  display: boolean = false;
  @Output() closedModal = new EventEmitter<void>();

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

  constructor(private http: HttpClient,
              private api: ApiService,
              private formbuilder: FormBuilder,
              private router: Router) {
    this.editRouteForm = this.formbuilder.group({
      inputBusStops: ['']
    })
  }

  ngAfterViewInit() {

  }

  private updateStopsMapWithList(stops: any[]): void {
    this.markersLayer.clearLayers();

    for(let i=0; i < stops.length; i++) {
      let busStop = this.availableStops.find((stop) => stop.stop_code === stops[i]);
      const marker = L.marker([busStop.latitude,busStop.longitude]);
      let num:Number = i+1;
      marker.bindPopup("Bus Stop " + num + "<br>Bus Stop Code: " + stops[i]);
      this.markersLayer.addLayer(marker);
    }
    this.markersLayer.addTo(this.map);
  }

  public inputStopsMap(event?: any):void {

    let array = this.editRouteForm.get('inputBusStops')?.value.split(',');
    this.markersLayer.clearLayers();

    for(let i=0; i < array.length; i++) {
      array[i] = array[i].replace(/^\s*/, "").replace(/\s*$/, "");
      let busStop = this.availableStops.find((stop) => (stop.stop_code.toString()) === array[i]);
      const marker = L.marker([busStop.latitude,busStop.longitude]);
      let num:Number = i+1;
      marker.bindPopup("Bus Stop " + num + "<br>Bus Stop Code: " + array[i]);
      this.markersLayer.addLayer(marker);
    }
    this.markersLayer.addTo(this.map);
  }


  public checkStops(event: any) {
    this.invalid = [];
    let input = this.editRouteForm.get('inputBusStops')?.value;
    if(input.length==0) {
      return;
    }
    let array = input.split(',');

    for(let i=0; i < array.length; i++) {
      array[i] = array[i].replace(/^\s*/, "").replace(/\s*$/, "");
      if(!this.availableStops.find((stop) => (stop.stop_code.toString()) === array[i])) {
        this.invalid.push({'id': i, 'stop_code': array[i]});
      }
    }
    this.valid = (this.invalid.length == 0);
  }

  onSubmit() {
    this.currentStops = this.editRouteForm.get('inputBusStops')?.value.split(',');

  }

  onConfirm() {
    let service = this.serviceNumber;
    let stops = this.currentStops;

    let params = {
      service: service,
      new_stops: stops
    }
    this.http.post<any>(this.api.API_URL + "/services/edit", params).subscribe({
        next: (message) => {
          console.log(message);
        },
        error: (e) => {
          console.log(e);
        }
      })
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

  toggleVisibility(stopsList?: any[]) {
    if(!this.visible) {
      this.initMap();
      if(stopsList) {
        this.updateStopsMapWithList(stopsList);
      }
    }
    this.visible = !this.visible;
  }

  clickClose() {
    this.map.off();
    this.map.remove();
    this.editRouteForm.reset();
    this.visible = false;
    this.closedModal.emit()
  }

}
