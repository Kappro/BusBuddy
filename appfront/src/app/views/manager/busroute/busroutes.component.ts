import {Component, AfterViewInit, signal, OnInit, ViewChild} from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import {Router, RouterLink} from '@angular/router';
import {
  BorderDirective,
  CardHeaderComponent,
  ContainerComponent,
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
  TabDirective,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  BadgeModule,
  CardTitleDirective, CardSubtitleDirective, CardTextDirective
} from '@coreui/angular';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../services/api.service";
import {DriverHistoryModalComponent} from "../_modals/driverhistorymodal/driverhistorymodal.component";
import {AddRouteModalComponent} from "../_modals/routemodals/addroute/addroute.component";
import {EditRouteModalComponent} from "../_modals/routemodals/editroute/editroute.component";
import {DeleteRouteModalComponent} from "../_modals/routemodals/deleteroute/deleteroute.component";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AddStopModalComponent} from "../_modals/stopmodals/addstop/addstop.component";
import {DeleteStopModalComponent} from "../_modals/stopmodals/deletestop/deletestop.component";

@Component({
    selector: 'app-busroutes',
    templateUrl: './busroutes.component.html',
    styleUrls: ['./busroutes.component.scss'],
    standalone: true,
  imports: [RouterLink, TabPanelComponent, TabDirective, BadgeModule,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent, BorderDirective, CardHeaderComponent, ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, CardTitleDirective, CardSubtitleDirective, CardTextDirective, AddRouteModalComponent, EditRouteModalComponent, DeleteRouteModalComponent, AddStopModalComponent, DeleteStopModalComponent, ReactiveFormsModule]
})
export class BusRoutesComponent implements AfterViewInit {

  public services: any[] = [];
  @ViewChild(AddRouteModalComponent) addRouteModal!: AddRouteModalComponent;
  @ViewChild(EditRouteModalComponent) editRouteModal!: EditRouteModalComponent;
  @ViewChild(DeleteRouteModalComponent) deleteRouteModal!: DeleteRouteModalComponent;
  @ViewChild(AddStopModalComponent) addStopModal!: AddStopModalComponent;
  @ViewChild(DeleteStopModalComponent) deleteStopModal!: DeleteStopModalComponent;
  public stops: any[] = [];
  public filteredStops: any[] = [];

  public searchStop: FormGroup;

  activeItem = signal(0);

  handleActiveItemChange(value: string | number | undefined) {
    this.activeItem.set(<number>value);
  }

  constructor(private http: HttpClient,
              private api: ApiService,
              private router: Router,
              private formbuilder: FormBuilder) {
    this.http.get<any>(this.api.API_URL + "/stops/get_all").subscribe({
        next: (message) => {
          // @ts-ignore
          this.stops = message;
          this.filteredStops = this.stops;
        },
        error: (e) => {
          console.log(e);
        }
      })
    this.http.get<any>(this.api.API_URL + "/services/get_all").subscribe({
        next: (message) => {
          // @ts-ignore
          this.services = message;
        },
        error: (e) => {
          console.log(e);
        }
      })
    this.searchStop = this.formbuilder.group({
      searchInput: [''],
    })
  }

  ngAfterViewInit(): void {

  }

  viewAddRouteModal() {
    this.addRouteModal.busStops = this.stops;
    this.addRouteModal.services = this.services;
    console.log(this.addRouteModal.busStops);
    this.addRouteModal.toggleVisibility();
  }

  viewEditRouteModal(service: string) {
    this.editRouteModal.serviceNumber = service;
    this.editRouteModal.availableStops = this.stops;
    this.http.post<any>(this.api.API_URL + "/stops/get_by_service", {'service_number': service}).subscribe({
        next: (message) => {
          // @ts-ignore
          const stopsList = message.map(stop => stop.stop_code)
          this.editRouteModal.oldStops = stopsList;
          this.editRouteModal.currentStops = stopsList;
          const formbuilder = new FormBuilder();
          this.editRouteModal.editRouteForm = formbuilder.group({
            inputBusStops: [this.editRouteModal.oldStops]
          })
          this.editRouteModal.toggleVisibility(stopsList);
        },
        error: (e) => {
          console.log(e);
        }
      });

  }

  viewDeleteRouteModal(service: string) {
    this.deleteRouteModal.serviceNumber = service;
    this.deleteRouteModal.availableStops = this.stops;
    this.http.post<any>(this.api.API_URL + "/stops/get_by_service", {'service_number': service}).subscribe({
        next: (message) => {
          // @ts-ignore
          const stopsList = message.map(stop => stop.stop_code)
          this.deleteRouteModal.stops = stopsList;
          const formbuilder = new FormBuilder();
          this.deleteRouteModal.deleteRouteForm = formbuilder.group({
            inputBusStops: {value: this.deleteRouteModal.stops, disabled: true}
          })
          this.deleteRouteModal.toggleVisibility(stopsList);
        },
        error: (e) => {
          console.log(e);
        }
      });
  }

  viewAddStopModal() {
    this.addStopModal.toggleVisibility();
  }

  viewDeleteStopModal(stop_code: string) {
    const params = {stop_code: stop_code};
    this.http.post<any>(this.api.API_URL + "/stops/get_stop_details", params).subscribe({
      next: (message) => {
        console.log(message);
        this.deleteStopModal.stop = message;
        this.deleteStopModal.toggleVisibility();
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  refresh() {
    this.http.get<any>(this.api.API_URL + "/stops/get_all").subscribe({
        next: (message) => {
          // @ts-ignore
          this.stops = message;
          this.http.get<any>(this.api.API_URL + "/services/get_all").subscribe({
            next: (message) => {
              // @ts-ignore
              this.services = message;
              this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
                this.router.navigate([this.router.url.split("#")[0]]).then(()=>{
                  console.log(`Refreshing ${this.router.url}`)
                })
              })
            },
            error: (e) => {
              console.log(e);
            }
          })
        },
        error: (e) => {
          console.log(e);
        }
      })
  }

  search(event?: any) {
    const keyword = this.searchStop.get('searchInput')?.value.toLowerCase();
    if(keyword.length == 0) {
      this.filteredStops = this.stops;
    }
    else{
      this.filteredStops = this.stops.filter(stop => ([stop.stop_code, stop.stop_name.toLowerCase()].join()).includes(keyword));
    }
  }
}
