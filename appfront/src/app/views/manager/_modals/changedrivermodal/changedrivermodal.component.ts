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
  ModalTitleDirective
} from "@coreui/angular";
import {IconDirective} from "@coreui/icons-angular";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {EventEmitter} from "@angular/core";
import {NgIf} from "@angular/common";

/**
 * Pop-up modal for manager to change driver of a new deployment before approving or during Buffer Time.
 */
@Component({
  selector: 'app-changedrivermodal',
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
    NgIf
  ],
  templateUrl: './changedrivermodal.component.html',
  styleUrl: './changedrivermodal.component.scss'
})
export class ChangeDriverModalComponent implements OnInit {
  /**
   * @ignore
   */
  public visible = false;
  /**
   * @ignore
   */
  // @ts-ignore
  public users: any[];
  /**
   * @ignore
   */
  // @ts-ignore
  public filteredDrivers: any[];
  /**
   * @ignore
   */
  public deployment: any = {};
  /**
   * @ignore
   */
  // @ts-ignore
  public searchDriver: FormGroup;

  /**
   * @ignore
   */
  @Output() closedModal = new EventEmitter<void>();

  /**
   * @ignore
   */
  constructor(private http: HttpClient,
              private api: ApiService,
              private formbuilder: FormBuilder) {
  }

  /**
   * Loads in all drivers on init.
   */
  ngOnInit() {
    this.http.get<any>(this.api.API_URL + "/drivers/get_all").subscribe({
      next: (message) => {
        this.users = message;
        console.log(this.users);
        this.filteredDrivers = this.users;
      },
      error: (e) => {
        this.users = [];
      }
    });
    this.searchDriver = this.formbuilder.group({
      searchInput: ['']
    })
  }

  /**
   * Toggles visibility of modal.
   */
  toggleVisibility() {
    this.visible = !this.visible;
    if (!this.visible) {
      this.filteredDrivers = this.users;
    }
  }

  /**
   * @ignore
   */
  handleVisibilityChange(event: any) {
    this.visible = event;
  }

  /**
   * Searches on every keyboard button press.
   */
  search(event: any) {
    const keyword = this.searchDriver.get('searchInput')?.value.toLowerCase();
    this.filteredDrivers = this.users.filter(item => item.name.toLowerCase().includes(keyword));
  }

  /**
   * Sends request to backend API to change driver for the provided deployment.
   * @param {number} deployment_uid UID of deployment to change driver for.
   * @param {number} driver_uid UID of new driver to change to.
   */
  changeDriver(deployment_uid: number, driver_uid: number) {
    console.log(deployment_uid)
    this.http.post<any>(this.api.API_URL + "/deployments/change_driver",
      {"deployment_uid": String(deployment_uid),
        "driver_uid": String(driver_uid)}).subscribe({
      next: (message) => {
        console.log(message);
        this.visible = false;
        this.closedModal.emit();
      },
      error: (e) => {
        console.log(e);
      }
    });
  }
}
