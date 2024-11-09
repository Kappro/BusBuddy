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
 * Pop-up component to inform driver on new deployment they have to go on.
 */
@Component({
  selector: 'app-newdeploymentmodal',
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
  templateUrl: './newdeployment.component.html',
  styleUrl: './newdeployment.component.scss'
})
export class NewDeploymentModalComponent implements OnInit {
  /**
   * @ignore
   */
  public visible = false;

  /**
   * @ignore
   */
  @Output() closedModal = new EventEmitter<boolean>();

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
   * Toggles visiblity of modal.
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
   * Closes modal and redirects user to the overview page where they will see their new deployment. Emits an event for parent to pick up.
   */
  goDeployment() {
    this.visible = false;
    this.router.navigateByUrl('/driver/overview').then(() => {
      console.log(`Going to ${this.router.url}`);
    });
    this.closedModal.emit();
  }
}
