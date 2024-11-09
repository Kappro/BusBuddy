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

/**
 * @ignore
 */
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

/**
 * Pop-up component for manager to edit a service.
 */
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

  /**
   * @ignore
   */
  private map!: L.Map;

  /**
   * @ignore
   */
  public serviceNumber: string = "";
  /**
   * @ignore
   */
  public visible: boolean = false;
  /**
   * @ignore
   */
  public currentStops: any[] = [];
  /**
   * @ignore
   */
  public oldStops: any[] = [];
  /**
   * @ignore
   */
  public availableStops: any[] = [];
  /**
   * @ignore
   */
  public valid: boolean = false;
  /**
   * @ignore
   */
  public editRouteForm: FormGroup;
  /**
   * @ignore
   */
  public invalid: any[] = [];

  /**
   * @ignore
   */
  display: boolean = false;
  /**
   * @ignore
   */
  @Output() closedModal = new EventEmitter<void>();

  /**
   * @ignore
   */
  private markersLayer = new L.LayerGroup();

  /**
   * Initialises map using Open Street Map tiles.
   */
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

  /**
   * @ignore
   */
  constructor(private http: HttpClient,
              private api: ApiService,
              private formbuilder: FormBuilder,
              private router: Router) {
    this.editRouteForm = this.formbuilder.group({
      inputBusStops: ['']
    })
  }

  /**
   * @ignore
   */
  ngAfterViewInit() {

  }

  /**
   * Updates map with new given stops.
   * @param stops List of bus stop objects with latitude and longitude to be plotted.
   * @private
   */
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

  /**
   * @ignore
   */
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

  /**
   * Check if stops currently exist. Fails if any stops do not exist in database.
   */
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

  /**
   * Loads in the new stops. Switches to confirmation modal.
   */
  onSubmit() {
    this.currentStops = this.editRouteForm.get('inputBusStops')?.value.split(',');
  }

  /**
   * On confirmation at confirmation modal. Sends request to backend API to complete edit.
   */
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

  /**
   * @ignore
   */
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

  /**
   * Toggles visibility of modal.
   * @param stopsList Optional. If opening modal and this is provided, will update the map with these markers.
   */
  toggleVisibility(stopsList?: any[]) {
    if(!this.visible) {
      try {this.initMap();}
      finally {
        if (stopsList) {
          this.updateStopsMapWithList(stopsList);
        }
      }
    }
    this.visible = !this.visible;
  }

  /**
   * Closes the modal. Emits an event for parent component to pick up.
   */
  clickClose() {
    this.map.off();
    this.map.remove();
    this.editRouteForm.reset();
    this.visible = false;
    this.closedModal.emit()
  }

}
