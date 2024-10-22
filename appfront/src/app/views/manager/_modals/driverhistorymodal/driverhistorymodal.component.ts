import {Component, Injectable, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../../services/api.service";
import {
  AvatarComponent,
  ButtonCloseDirective,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  CardTextDirective,
  CardTitleDirective,
  ContainerComponent,
  FormControlDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalContentComponent,
  ModalDialogComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective, TableDirective
} from "@coreui/angular";
import {IconDirective} from "@coreui/icons-angular";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {EventEmitter} from "@angular/core";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-driverhistorymodal',
  standalone: true,
  imports: [
    ButtonDirective,
    FormControlDirective,
    IconDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalContentComponent,
    ModalDialogComponent,
    ModalHeaderComponent,
    ReactiveFormsModule,
    ModalTitleDirective,
    ButtonCloseDirective,
    ModalFooterComponent,
    ContainerComponent,
    CardComponent,
    CardBodyComponent,
    CardTitleDirective,
    CardTextDirective,
    CardGroupComponent,
    NgIf,
    AvatarComponent,
    TableDirective
  ],
  templateUrl: './driverhistorymodal.component.html',
  styleUrl: './driverhistorymodal.component.scss'
})
export class DriverHistoryModalComponent implements OnInit {
  public visible: boolean = false;
  public driver_uid: number | string = -2;
  public driver_name: string = "BadD"
  public history: any[] = [];

  @Output() visibilityChange = new EventEmitter<boolean>();

  constructor(private http: HttpClient,
              private api: ApiService) {
  }

  ngOnInit() {
  }

  toggleVisibility() {
    this.visible = !this.visible;
    if (!this.visible) {
      this.http.post<any>(this.api.API_URL + "/drivers/get_history_by_uid",
        {"driver_uid": String(this.driver_uid)}).subscribe({
        next: (message) => {
          // @ts-ignore
          this.history = message;
          console.log(message);
        },
        error: (e) => {
          console.log(e);
        }
      })
    }
  }

  handleVisibilityChange(event: any) {
    this.visible = event;
  }
}
