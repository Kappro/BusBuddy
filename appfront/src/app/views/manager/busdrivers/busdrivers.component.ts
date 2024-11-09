import {DOCUMENT, NgIf, NgStyle} from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  Renderer2,
  signal, ViewChild,
  WritableSignal
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
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
  CardTitleDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../services/api.service";
import {ChangeDriverModalComponent} from "../_modals/changedrivermodal/changedrivermodal.component";
import {DriverHistoryModalComponent} from "../_modals/driverhistorymodal/driverhistorymodal.component";
/**
 * @ignore
 */
interface IUser {
  name: string;
  current_state: string;
  date_registered: string;
  last_duty: string;
  avatar: string;
  color: string;
  email: string;
  contact: string;
}

/**
 * View component for manager to see bus drivers' details and their deployment histories.
 */
@Component({
    selector: 'app-busdrivers',
    templateUrl: './busdrivers.component.html',
    styleUrls: ['./busdrivers.component.scss'],
    standalone: true,
  imports: [ReactiveFormsModule, ChartjsComponent, IconDirective, AvatarComponent, NgStyle,
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
    FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, FormLabelDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, ColDirective, CardTitleDirective, ChangeDriverModalComponent, DriverHistoryModalComponent, NgIf
  ]
})
export class BusdriversComponent implements AfterViewInit {
  /**
   * @ignore
   */
  // @ts-ignore
  public users: any[];
  /**
   * View can employ view driver history pop-up.
   */
  @ViewChild(DriverHistoryModalComponent) driverHistoryModal!: DriverHistoryModalComponent;

  /**
   * Loads in all drivers on construct.
   */
  constructor(private http: HttpClient, private api: ApiService) {
    this.http.get<any>(this.api.API_URL+"/drivers/get_all").subscribe({
      next: (message) => {
        this.users = message;
        console.log(this.users);
      },
      error: (e) => {
        this.users = [];
      }
    });
  }

  /**
   * @ignore
   */
  ngAfterViewInit() {
    if(this.driverHistoryModal) {
      console.log('Modal component is available.')
    }
  }

  /**
   * Opens view driver history modal, loading in clicked driver's UID and name.
   * @param driver_uid UID of driver whose history is to be viewed.
   * @param driver_name Name of driver whose history is to be viewed.
   */
  openViewHistory(driver_uid: number, driver_name: string) {
    if(this.driverHistoryModal) {
      this.http.post<any>(this.api.API_URL + "/drivers/get_history_by_uid", {'driver_uid': String(driver_uid)}).subscribe({
        next: (message) => {
          this.driverHistoryModal.history = message;
          this.driverHistoryModal.driver_name = driver_name;
          console.log(this.driverHistoryModal.history);
          this.driverHistoryModal.toggleVisibility()
          console.log(this.driverHistoryModal.visible)
        },
        error: (e) => {
          console.log(e)
        }
      });
    } else {
      console.error("Modal component is not initialised");
    }
  }
}
