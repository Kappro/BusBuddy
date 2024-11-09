import {DOCUMENT, NgIf, NgStyle, NgTemplateOutlet} from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  Renderer2,
  signal,
  WritableSignal
} from '@angular/core';
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
  ProgressBarComponent, SpinnerComponent, CardSubtitleDirective, CardTitleDirective,
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
const redIconRetinaUrl = 'assets/marker-icon-red-2x.png';
const redIconUrl = 'assets/marker-icon-red.png';
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
const largeIcon = L.icon({
  iconRetinaUrl: redIconRetinaUrl,
  iconUrl: redIconUrl,
  shadowUrl,
  iconSize: [38, 61],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

/**
 * @ignore
 */
interface IDeployment {
  driver_id: Number,
  bus_license_plate: String,
  datetime_start: /*Date*/ String,
  datetime_end: /*Date*/ String,
  current_status: String,
  status_log: String,
  uid: Number
}

/**
 * @ignore
 */
interface IBus {
  service_number: string,
  capacity: Number,
  current_load: string,
  current_status: string,
  license_plate: string,
  status_log: string
}
/**
 * @ignore
 */
interface IBusStop {
  long: number;
  lat: number;
}

/**
 * Display's driver's current employment and provides functions to update driver's current progress on the drive.
 */
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
    ProgressBarComponent, NgTemplateOutlet, SpinnerComponent, NgIf, CardSubtitleDirective, CardTitleDirective
  ]
})
export class OverviewComponent implements OnInit, AfterViewInit {

  /**
   * @ignore
   */
  public deployment: any;
  /**
   * @ignore
   */
  public route: any[] = [];
  /**
   * @ignore
   */
  public exists = "loading";
  /**
   * @ignore
   */
  public mapInitialised = false;
  /**
   * @ignore
   */
  public inited = false;
  /**
   * @ignore
   */
  public loadingMap = false;
  /**
   * @ignore
   */
  public map!: L.Map;
  /**
   * @ignore
   */
  public markersLayer = new L.LayerGroup();
  /**
   * @ignore
   */
  public nextStopName: string = "";

  /**
   * Initialises the map using Open Street Map tiles.
   */
  public async initMap(): Promise<void> {
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
    console.log("Loaded map")
  }

  /**
   * @ignore
   */
  constructor(private http: HttpClient,
              private api: ApiService,
              private auth: AuthService,
              private router: Router) {
  }

  /**
   * Uses a comma-separated list of stop codes to display those stops on the map as markers.
   */
  public inputStopsMap():void {
    if(!this.loadingMap) {
      this.loadingMap = true;
    }
    this.markersLayer.clearLayers();

    for(let i=0; i < this.route.length; i++) {
      let marker = L.marker([this.route[i].latitude,this.route[i].longitude]);
      let num: number = i+1;
      if(i===this.deployment.current_stop) {
        marker = L.marker([this.route[i].latitude,this.route[i].longitude], { icon: largeIcon });
      }
      marker.bindPopup("Bus Stop " + num + "<br>Bus Stop Code: " + this.route[i].stop_code +
        "<br>Bus Stop Name: " + this.route[i].stop_name);
      this.markersLayer.addLayer(marker);
    }
    this.markersLayer.addTo(this.map);
    this.loadingMap = false;
  }

  /**
   * Refreshes the component without needing to reload the page. Starts a clock to constantly check if deployment has been cancelled, or if new deployments come in when there are no current deployments.
   */
  refresh(): void {
    if(this.router.url!=='/driver/overview') {
      return;
    }
    this.auth.retrieveIdentity().then(account => {
      this.http.get<any>(this.api.API_URL + "/drivers/get_current_deployment").subscribe({
        next: (message) => {
          if(message.deployment.uid === -1) {
            if(this.mapInitialised) {
              this.map.off();
              this.map.remove();
              this.mapInitialised = false;
            }
            this.deployment = null;
            this.exists = "no";
            setTimeout(() => {this.refresh();}, 500)
          }
          else {
            if(this.inited && !this.mapInitialised) {
              this.initMap().then(() => {
                this.inputStopsMap();
                this.mapInitialised = true;
              });
            }
            this.deployment = message.deployment;
            this.route = message.route;
            this.exists = "exists";
            const stop_number = (this.deployment.current_stop === -1) ? 0 : this.deployment.current_stop;
            if(this.deployment.current_status!=='Returning' && stop_number>=this.route.length) {
              const params2 = {deployment_uid: message.deployment.uid};
              this.http.post<any>(this.api.API_URL + "/deployments/complete_deployment", params2).subscribe({
                next: (message) => {
                  console.log(message);
                  window.location.reload();
                },
                error: (e) => {
                  console.log(e);
                }
              })
            }
            const stop_number_imp = this.deployment.current_stop === this.route.length ? this.route.length-1 : stop_number;
            this.nextStopName = message.route[stop_number_imp].stop_name;
            if(message.deployment.current_status === 'Buffer Time') {
              setTimeout(() => {this.refresh();}, 500);
            }
          }
        },
        error: (e) => {
          console.log(e);
        }
      });
    });
  }

  /**
   * @ignore
   */
  ngOnInit(): void {
    this.refresh();
  }

  /**
   * @ignore
   */
  ngAfterViewInit() {
    setTimeout(() => {
      if(this.exists==='exists') {
        this.initMap().then(() => {
          this.inputStopsMap();
          this.mapInitialised = true;
        });
      }
      this.inited = true;
    }, 1500);
  }

  /**
   * Provides functionality to start a deployment that is currently still on Buffer Time.
   */
  startDrive() {
    this.http.post<any>(this.api.API_URL + "/deployments/start_drive", {deployment_uid: this.deployment.uid}).subscribe({
      next: (message) => {
        console.log(message);
        window.location.reload();
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  /**
   * Provides functionality for driver to indicate progress when on the deployment.
   */
  nextStop() {
    this.http.post<any>(this.api.API_URL + "/deployments/reach_next_stop", {deployment_uid: this.deployment.uid}).subscribe({
      next: (message) => {
        console.log(message);
        this.refresh();
        setTimeout(() => {
          this.loadingMap = true;
          this.inputStopsMap();
        }, 1000);
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  /**
   * Provides functionality for driver to indicate completion of deployment, having returned the bus to the depot after reaching last stop.
   */
  endDrive() {
    this.http.post<any>(this.api.API_URL + "/deployments/return_bus", {deployment_uid: this.deployment.uid}).subscribe({
      next: (message) => {
        console.log(message);
        this.loadingMap = true;
        this.refresh();
        setTimeout(() => {this.inputStopsMap();}, 1000);
      },
      error: (e) => {
        console.log(e);
      }
    })
  }
}
