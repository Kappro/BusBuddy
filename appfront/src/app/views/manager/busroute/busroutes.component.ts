import {Component, AfterViewInit, signal, OnInit, ViewChild} from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { RouterLink } from '@angular/router';
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

@Component({
    selector: 'app-busroutes',
    templateUrl: './busroutes.component.html',
    styleUrls: ['./busroutes.component.scss'],
    standalone: true,
  imports: [RouterLink, TabPanelComponent, TabDirective, BadgeModule,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent, BorderDirective, CardHeaderComponent, ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, CardTitleDirective, CardSubtitleDirective, CardTextDirective, AddRouteModalComponent, EditRouteModalComponent, DeleteRouteModalComponent]
})
export class BusRoutesComponent implements AfterViewInit {

  public services: any[] = [];
  @ViewChild(AddRouteModalComponent) addRouteModal!: AddRouteModalComponent;
  @ViewChild(EditRouteModalComponent) editRouteModal!: EditRouteModalComponent;
  @ViewChild(DeleteRouteModalComponent) deleteRouteModal!: DeleteRouteModalComponent;
  public stops: any[] = [];

  activeItem = signal(0);

  handleActiveItemChange(value: string | number | undefined) {
    this.activeItem.set(<number>value);
  }

  constructor(private http: HttpClient,
              private api: ApiService) {
    this.http.get<any>(this.api.API_URL + "/stops/get_all").subscribe({
        next: (message) => {
          // @ts-ignore
          this.stops = message;
          console.log(message);
        },
        error: (e) => {
          console.log(e);
        }
      })
    this.http.get<any>(this.api.API_URL + "/services/get_all").subscribe({
        next: (message) => {
          // @ts-ignore
          this.services = message;
          console.log(message);
        },
        error: (e) => {
          console.log(e);
        }
      })
  }

  ngAfterViewInit(): void {

  }

  resetModals() {
    this.addRouteModal.clickClose();
    this.deleteRouteModal.clickClose();
    this.editRouteModal.clickClose();
  }

  viewAddRouteModal() {
    this.addRouteModal.busStops = this.stops;
    this.addRouteModal.services = this.services;
    console.log(this.addRouteModal.busStops);
    this.addRouteModal.toggleVisibility();
  }

  viewEditRouteModal() {

    this.editRouteModal.toggleVisibility();
  }

  viewDeleteRouteModal() {
    this.deleteRouteModal.toggleVisibility();
  }
}
