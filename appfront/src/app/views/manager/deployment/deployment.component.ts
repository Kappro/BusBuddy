import {Component, Input, signal} from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
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
import {ApiService} from "../../../services/api.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {NgTemplateOutlet} from "@angular/common";

interface IRequest {
  requestId: number,
  serviceNo: string,
  driverId: string,
  driverName: string,
  busLicensePlate: string,
  dateTimeStart: string,
  currentStatus: string, // for now
  dateTimeEnd: string
}

@Component({
    selector: 'app-deployment',
    templateUrl: './deployment.component.html',
    styleUrls: ['./deployment.component.scss'],
    standalone: true,
  imports: [TabPanelComponent, TabDirective, BadgeModule,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent, BorderDirective, CardHeaderComponent, ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, CardTitleDirective, CardSubtitleDirective, CardTextDirective, NgTemplateOutlet]
})
export class DeploymentComponent {

  public deployments: any[] = [];

  // 'driver_id': self._driver_id,
  // 'bus_license_plate': self._bus_license_plate,
  // 'datetime_start': self._datetime_start,
  // 'datetime_end': self._datetime_end,
  // 'current_status': self._current_status.value,
  // 'uid': self._uid,
  // 'service_number'

  constructor(private http: HttpClient,
              private api: ApiService,
              private router: Router) {
    this.http.get<any>(this.api.API_URL + "/deployments/get_all").subscribe({
      next: (message) => {
        this.deployments = message;
        console.log(this.deployments);
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  activeItem = signal(0);

  handleActiveItemChange(value: string | number | undefined) {
    this.activeItem.set(<number>value);
  }

}
