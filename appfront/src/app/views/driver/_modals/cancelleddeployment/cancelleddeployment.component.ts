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
 * Pop-up component to inform driver that their current deployment has been cancelled.
 */
@Component({
  selector: 'app-cancelleddeploymentmodal',
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
  templateUrl: './cancelleddeployment.component.html',
  styleUrl: './cancelleddeployment.component.scss'
})
export class CancelledDeploymentModalComponent implements OnInit {
  /**
   * @ignore
   */
  public visible = false;

  /**
   * @ignore
   */
  @Output() closedModal = new EventEmitter<void>();

  /**
   * @ignore
   */
  constructor(private router: Router) {
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
   * Closes modal and emits an event that is picked up by parent component.
   */
  close() {
    this.visible = false;
    this.closedModal.emit();
  }
}
