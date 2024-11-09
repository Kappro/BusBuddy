import { DOCUMENT, NgStyle } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import { RouterLink } from '@angular/router';
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
  ColDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../services/api.service";
import {AuthService} from "../../../services/auth.service";

/**
 * @ignore
 */
interface IDeployment {
  bus_license_plate : String,
  current_status: String,
  datetime_start: String,
  datetime_end: String
  uid: number
}

/**
 * Displays driver's deployment history, excluding ongoing ones.
 */
@Component({
  selector: 'app-drivinghistory',
  templateUrl: './drivinghistory.component.html',
  styleUrls: ['./drivinghistory.component.scss'],
  standalone: true,
  imports: [RouterLink,
    ReactiveFormsModule,
    ChartjsComponent,
    IconDirective,
    AvatarComponent,
    NgStyle,
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
    ColDirective
  ]
})
export class DrivingHistoryComponent implements OnInit {

  /**
   * @ignore
   */
  public history: any[] = [];

  /**
   * Component uses HttpClient, ApiService and AuthService injectables. On construction, driver's history is loaded in from backend.
   */
  constructor(private http: HttpClient,
              private api: ApiService,
              private auth: AuthService) {
    this.auth.retrieveIdentity().then(user => {
      const uid = user.uid;
      this.http.post<any>(this.api.API_URL + "/drivers/get_history_by_uid",
        {"driver_uid": String(uid)}).subscribe({
        next: (message) => {
          // @ts-ignore
          this.history = message;
          console.log(message);
        },
        error: (e) => {
          console.log(e);
        }
      })
    });
  }

  /**
   * @ignore
   */
  ngOnInit(): void {

  }

}
