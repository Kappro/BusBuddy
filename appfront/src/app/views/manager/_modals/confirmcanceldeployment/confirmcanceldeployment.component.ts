import {Component, Injectable, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../../services/api.service";
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
  ModalTitleDirective
} from "@coreui/angular";
import {IconDirective} from "@coreui/icons-angular";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {EventEmitter} from "@angular/core";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";

/**
 * Pop-up modal for manager to confirm cancellation of deployment.
 */
@Component({
  selector: 'app-confirmcanceldeploymentmodal',
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
    ColComponent
  ],
  templateUrl: './confirmcanceldeployment.component.html',
  styleUrl: './confirmcanceldeployment.component.scss'
})
export class ConfirmCancelDeploymentModalComponent implements OnInit {
  /**
   * @ignore
   */
  public visible = false;
  /**
   * @ignore
   */
  public deployment_uid!: number;

  /**
   * @ignore
   */
  @Output() closedModal = new EventEmitter<void>();

  /**
   * @ignore
   */
  constructor(private router: Router,
              private http: HttpClient,
              private api: ApiService) {
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
   * Sends request to backend API to cancel the given deployment.
   */
  cancel() {
    this.http.post<any>(this.api.API_URL + "/deployments/cancel", {deployment_uid: this.deployment_uid}).subscribe({
      next: (message) => {
        console.log(message);
        this.visible = false;
        this.closedModal.emit();
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  /**
   * Closes the modal. Emits an event for parent component to pick up.
   */
  close() {
    this.visible = false;
    this.closedModal.emit();
  }
}
