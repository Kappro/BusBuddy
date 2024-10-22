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

  // @ts-ignore
  public users: any[];
  @ViewChild(DriverHistoryModalComponent) driverHistoryModal!: DriverHistoryModalComponent;
  public isViewingHistory: boolean = false;

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

  activeItem = signal(0);

  ngAfterViewInit() {
    if(this.driverHistoryModal) {
      console.log('Modal component is available.')
    }
  }

  handleActiveItemChange(value: string | number | undefined) {
    this.activeItem.set(<number>value);
  }

  openViewHistory(driver_uid: number, driver_name: string) {
    if(this.driverHistoryModal) {
      this.http.post<any>(this.api.API_URL + "/drivers/get_history_by_uid", {'driver_uid': String(driver_uid)}).subscribe({
        next: (message) => {
          this.driverHistoryModal.history = message;
          this.driverHistoryModal.driver_name = driver_name;
          console.log(this.driverHistoryModal.history);
          this.isViewingHistory = true;
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

  handleDriverHistoryModalVisibility(visible: boolean) {
    this.isViewingHistory = visible;
  }
}
