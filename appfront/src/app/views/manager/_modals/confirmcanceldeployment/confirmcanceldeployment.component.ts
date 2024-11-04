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
  public visible = false;
  public deployment_uid!: number;

  @Output() closedModal = new EventEmitter<void>();

  constructor(private router: Router,
              private http: HttpClient,
              private api: ApiService) {
  }

  ngOnInit() {

  }

  toggleVisibility() {
    this.visible = !this.visible;
  }

  handleVisibilityChange(event: any) {
    this.visible = event;
  }

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

  close() {
    this.visible = false;
    this.closedModal.emit();
  }
}
