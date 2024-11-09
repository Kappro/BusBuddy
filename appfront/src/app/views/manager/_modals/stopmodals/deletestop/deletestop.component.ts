import {Component, Injectable, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../../../services/api.service";
import {
  ButtonCloseDirective,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  CardTextDirective,
  CardTitleDirective, ColComponent,
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
  ModalTitleDirective, ModalToggleDirective, RowComponent
} from "@coreui/angular";
import {IconDirective} from "@coreui/icons-angular";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {EventEmitter} from "@angular/core";
import {NgIf} from "@angular/common";
import {Access} from "../../../../../_models/account";
import {firstValueFrom} from "rxjs";

/**
 * Pop-up modal for manager to delete an existing bus stop.
 */
@Component({
  selector: 'app-deletestopmodal',
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
    ModalToggleDirective,
    ColComponent,
    RowComponent
  ],
  templateUrl: './deletestop.component.html',
  styleUrl: './deletestop.component.scss'
})
export class DeleteStopModalComponent implements OnInit {
  /**
   * @ignore
   */
  public visible = false;
  /**
   * @ignore
   */
  public stop: any = {
    stop_code: "",
    stop_name: "",
    latitude: "",
    longitude: "",
    services: []
  };

  /**
   * @ignore
   */
  @Output() closedModal = new EventEmitter<void>();

  /**
   * @ignore
   */
  constructor(private http: HttpClient,
              private api: ApiService
              ) {
  }

  /**
   * @ignore
   */
  ngOnInit() {

  }

  /**
   * Toggles visibility of modal.
   */
  toggleVisibility() {
    this.visible = !this.visible;
  }

  /**
   * @ignore
   */
  handleVisibilityChange(event: any) {
    this.visible = event;
  }

  /**
   * On confirmation. Sends request to backend API to complete deletion of bus stop.
   */
  onConfirm() {
    const params = {stop_code: this.stop.stop_code};
    this.http.post<any>(this.api.API_URL + "/stops/delete", params).subscribe({
      next: (message) => {
        console.log(message);
      },
      error: (e) => {
        console.log(e);
      }
    })
  }
}
