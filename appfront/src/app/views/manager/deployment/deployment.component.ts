import {Component, Input, signal, ViewChild} from '@angular/core';
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
import {ChangeDriverModalComponent} from "../_modals/changedrivermodal/changedrivermodal.component";
import {
  ConfirmCancelDeploymentModalComponent
} from "../_modals/confirmcanceldeployment/confirmcanceldeployment.component";

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
    TabsListComponent, BorderDirective, CardHeaderComponent, ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, CardTitleDirective, CardSubtitleDirective, CardTextDirective, NgTemplateOutlet, ChangeDriverModalComponent, ConfirmCancelDeploymentModalComponent]
})
export class DeploymentComponent {

  public deployments: any[] = [];

  @ViewChild(ChangeDriverModalComponent) changeDriverModal!: ChangeDriverModalComponent;
  @ViewChild(ConfirmCancelDeploymentModalComponent) cancelDeploymentModal!: ConfirmCancelDeploymentModalComponent;

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

  refresh() {
    this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
      this.router.navigate([this.router.url]).then(()=>{
        console.log(`Refreshing ${this.router.url}`)
      })
    })
  }

  openChangeDriver(deployment_uid: number) {
    if(this.changeDriverModal) {
      this.http.post<any>(this.api.API_URL + "/deployments/get_by_uid", {'deployment_uid': String(deployment_uid)}).subscribe({
        next: (message) => {
          this.changeDriverModal.deployment = message;
          console.log(this.changeDriverModal.deployment);
          this.changeDriverModal.toggleVisibility();
          console.log(this.changeDriverModal.visible);
        },
        error: (e) => {
          console.log(e);
        }
      });
    } else {
      console.error("Modal component is not initialised");
    }
  }

  openCancelConfirmation(deployment_uid: number) {
    if(this.cancelDeploymentModal) {
      this.cancelDeploymentModal.deployment_uid = deployment_uid;
      this.cancelDeploymentModal.toggleVisibility();
    }
  }

}
