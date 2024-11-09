import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import {DOCUMENT, NgIf, NgStyle} from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import {FormControl, FormsModule, ReactiveFormsModule, FormGroup, FormBuilder} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { AvatarComponent, ModalModule,
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
 * Pop-up modal that allows manager to add a new service.
 */
@Component({
    selector: 'app-addroutemodal',
    templateUrl: './addroute.component.html',
    styleUrls: ['./addroute.component.scss'],
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
    CardHeaderComponent, ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgIf]
})
export class AddRouteModalComponent implements AfterViewInit {

  /**
   * @ignore
   */
  private map!: L.Map;
  /**
   * @ignore
   */
  public visible: boolean = false;
  /**
   * @ignore
   */
  private markersLayer = new L.LayerGroup();
  /**
   * @ignore
   */
  public busStops: any[] = [];
  /**
   * @ignore
   */
  public services: any[] = [];
  /**
   * @ignore
   */
  public addRouteForm: FormGroup;
  /**
   * @ignore
   */
  public valid: boolean = false;
  /**
   * @ignore
   */
  public duplicate: boolean = false;
  /**
   * @ignore
   */
  public empty: boolean = true;
  /**
   * @ignore
   */
  public invalid: any[] = [];

  /**
   * @ignore
   */
  @Output() closedModal = new EventEmitter<void>();

  /**
   * Initialises map with Open Street Map tiles.
   */
  public initMap(): void {
    this.map = L.map('map', {
      center: [ 1.344365, 103.694433 ],
      zoom: 15
    });

    const tiles = L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
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
    this.addRouteForm = this.formbuilder.group({
      inputBusService: [''],
      inputBusStops: ['']
    })
  }

  /**
   * @ignore
   */
  ngAfterViewInit(): void {

  }

  /**
   * Validity check for service number field. Fails if it currently exists.
   */
  public checkServiceNumber(event: any) {
    let input = this.addRouteForm.get('inputBusService')?.value;
    this.empty = (input.length === 0);
    this.duplicate = (this.services.find((service) => ((service.service_number.toString()) === input)) != undefined);
  }

  /**
   * Validity check for bus stops field. Fails if any stop currently does not exist.
   */
  public checkStops(event: any) {
    this.invalid = [];
    let input = this.addRouteForm.get('inputBusStops')?.value;
    if(input.length==0) {
      return;
    }
    let array = input.split(',');

    for(let i=0; i < array.length; i++) {
      array[i] = array[i].replace(/^\s*/, "").replace(/\s*$/, "");
      if(!this.busStops.find((stop) => (stop.stop_code.toString()) === array[i])) {
        this.invalid.push({'id': i, 'stop_code': array[i]});
      }
    }
    this.valid = (this.invalid.length == 0);
  }

  /**
   * Takes in comma-separated list of bus stop objects with latitude and longitude to plot on the map.
   */
  public inputStopsMap(event: any):void {

    let array = this.addRouteForm.get('inputBusStops')?.value.split(',');
    this.markersLayer.clearLayers();

    for(let i=0; i < array.length; i++) {
      array[i] = array[i].replace(/^\s*/, "").replace(/\s*$/, "");
      let busStop = this.busStops.find((stop) => (stop.stop_code.toString()) === array[i]);
      const marker = L.marker([busStop.latitude,busStop.longitude]);
      let num:Number = i+1;
      marker.bindPopup("Bus Stop " + num + "<br>Bus Stop Code: " + array[i]);
      this.markersLayer.addLayer(marker);
    }
    this.markersLayer.addTo(this.map);
  }

  /**
   * @ignore
   */
  handleVisibilityChange(event: any) {
    this.visible = event;
  }

  /**
   * Submits request to backend API based on form inputs to create a new service.
   */
  onSubmit() {
    let service = this.addRouteForm.get('inputBusService')?.value;
    let stops = this.addRouteForm.get('inputBusStops')?.value.split(',');

    let params = {
      service: service,
      stops: stops
    }
    this.http.post<any>(this.api.API_URL + "/services/add_new", params).subscribe({
        next: (message) => {
          console.log(message);
        },
        error: (e) => {
          console.log(e);
        }
      })
  }

  /**
   * Toggles visibility of modal.
   */
  toggleVisibility() {
    if(!this.visible) {
      try {this.initMap();}
      finally {}
    }
    this.visible = !this.visible;
    // setTimeout(() => {
    //   if (!this.visible) {
    //       console.log('HIDDEN_ADD');
    //   } else {
    //       console.log('VISIBLE_ADD');
    //
    //       this.initMap();
    //   }
    // }, 1000)
  }

  /**
   * Closes the modal. Emits an event for parent component to pick up.
   */
  clickClose() {
    this.map.off();
    this.map.remove();
    this.addRouteForm.reset();
    this.visible = false;
    this.closedModal.emit();
  }

}
