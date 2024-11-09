import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { DOCUMENT, NgStyle } from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink, ActivatedRoute, Router} from '@angular/router';
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
import * as L from 'leaflet';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../../../services/api.service";

/**
 * @ignore
 */
interface IBusStop {
  long: number;
  lat: number;
}

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
 * Pop-up modal for manager to delete an existing route.
 */
@Component({
    selector: 'app-deleteroutemodal',
    templateUrl: './deleteroute.component.html',
    styleUrls: ['./deleteroute.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, ChartjsComponent, AvatarComponent, NgStyle,
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
export class DeleteRouteModalComponent implements AfterViewInit {

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
  display: boolean = false;
  /**
   * @ignore
   */
  public visible: boolean = false;
  /**
   * @ignore
   */
  public availableStops: any[] = [];
  /**
   * @ignore
   */
  public stops: any[] = [];
  /**
   * @ignore
   */
  @Output() closedModal = new EventEmitter<void>();
  /**
   * @ignore
   */
  private markersLayer = new L.LayerGroup();
  /**
   * @ignore
   */
  public deleteRouteForm: FormGroup;

  /**
   * Initialises map using Open Street Map tiles.
   */
  public initMap(): void {
    this.map = L.map('mapdel', {
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
    this.deleteRouteForm = this.formbuilder.group({
      inputBusStops: ['']
    })
  }

  /**
   * @ignore
   */
  ngAfterViewInit(): void {

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
  handleVisibilityChange(event: any) {
    this.visible = event;
    // setTimeout(() => {
    //   if (this.visible == false) {
    //       console.log('HIDDEN_DELETE');
    //   } else {
    //       console.log('VISIBLE_DELETE');
    //
    //       this.initMap();
    //
    //       for(var i=0; i < this.routes.length; i++) {
    //         if(this.routes[i].routeId == this.routeId)
    //         {
    //           console.log(this.routes[i].stopsList);
    //           (<HTMLInputElement>document.getElementById("inputBusServiceDel")).value = this.routes[i].serviceNumber;
    //           (<HTMLInputElement>document.getElementById("delBusStopList")).value = this.routes[i].stopsList.toString();
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
      finally{
        if(stopsList) {
        this.updateStopsMapWithList(stopsList);
      }}
    }
    this.visible = !this.visible;
  }

  /**
   * Closes the modal. Emits an event for parent component to pick up.
   */
  clickClose() {
    this.map.off();
    this.map.remove();
    this.deleteRouteForm.reset();
    this.visible = false;
    this.closedModal.emit();
  }

  /**
   * Confirms deletion of service. Sends request to backend API to complete the deletion.
   */
  onConfirm() {
    this.http.post<any>(this.api.API_URL + "/services/delete", {'service_number': this.serviceNumber}).subscribe({
        next: (message) => {
          console.log(message);
        },
        error: (e) => {
          console.log(e);
        }
      });
  }
}
