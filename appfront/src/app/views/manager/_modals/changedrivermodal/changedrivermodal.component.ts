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
  public visible = false;
  // @ts-ignore
  public users: any[];
  // @ts-ignore
  public filteredDrivers: any[];
  public deployment: any = {};
  // @ts-ignore
  public searchDriver: FormGroup;

  @Output() visibilityChange = new EventEmitter<boolean>();

  constructor(private http: HttpClient,
              private api: ApiService,
              private formbuilder: FormBuilder) {
  }

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

  toggleVisibility() {
    this.visible = !this.visible;
    if (!this.visible) {
      this.filteredDrivers = this.users;
    }
  }

  handleVisibilityChange(event: any) {
    this.visible = event;
  }

  search(event: any) {
    // @ts-ignore
    const keyword = this.searchDriver.get('searchInput').value.toLowerCase();
    console.log(keyword)
    this.filteredDrivers = this.users.filter(item => item.name.toLowerCase().includes(keyword));
  }

  changeDriver(deployment_uid: number, driver_uid: number) {
    console.log(deployment_uid)
    this.http.post<any>(this.api.API_URL + "/deployments/change_driver",
      {"deployment_uid": String(deployment_uid),
        "driver_uid": String(driver_uid)}).subscribe({
      next: (message) => {
        console.log(message);
        location.reload();
      },
      error: (e) => {
        console.log(e);
      }
    });
  }
}
