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

/**
 * Pop-up component that shows given driver's driving history.
 */
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
  /**
   * @ignore
   */
  public visible: boolean = false;
  /**
   * @ignore
   */
  public driver_uid: number | string = -2;
  /**
   * @ignore
   */
  public driver_name: string = "BadD";
  /**
   * @ignore
   */
  public history: any[] = [];

  /**
   * @ignore
   */
  @Output() visibilityChange = new EventEmitter<boolean>();

  /**
   * @ignore
   */
  constructor(private http: HttpClient,
              private api: ApiService) {
  }

  /**
   * @ignore
   */
  ngOnInit() {
  }

  /**
   * Toggles visibility of modal. Requests backend API for driver's history based on clicked driver's UID, only when opening the modal.
   */
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

  /**
   * @ignore
   */
  handleVisibilityChange(event: any) {
    this.visible = event;
  }
}
