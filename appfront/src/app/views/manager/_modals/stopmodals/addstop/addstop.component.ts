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
  ModalTitleDirective, ModalToggleDirective
} from "@coreui/angular";
import {IconDirective} from "@coreui/icons-angular";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {EventEmitter} from "@angular/core";
import {NgIf} from "@angular/common";
import {Access} from "../../../../../_models/account";
import {firstValueFrom} from "rxjs";

/**
 * Pop-up modal for manager to add bus stops.
 */
@Component({
  selector: 'app-addstopmodal',
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
    ModalToggleDirective
  ],
  templateUrl: './addstop.component.html',
  styleUrl: './addstop.component.scss'
})
export class AddStopModalComponent implements OnInit {
  /**
   * @ignore
   */
  public visible = false;
  /**
   * @ignore
   */
  // @ts-ignore
  public existingStops: any[] = [];
  /**
   * @ignore
   */
  public deployment: any = {};
  /**
   * @ignore
   */
  // @ts-ignore
  public addStopForm: FormGroup;

  /**
   * @ignore
   */
  public valid: boolean = false;

  /**
   * @ignore
   */
  public validities = {
    codeNumber: true,
    codeNotEmpty: false,
    codeNotDuplicate: true,
    name: false,
    lat: false,
    long: false
  }

  /**
   * @ignore
   */
  @Output() closedModal = new EventEmitter<void>();

  /**
   * @ignore
   */
  constructor(private http: HttpClient,
              private api: ApiService,
              private formbuilder: FormBuilder,
              ) {
  }

  /**
   * Obtains list of all bus stops on init.
   */
  ngOnInit() {
    this.http.get<any>(this.api.API_URL + "/stops/get_all").subscribe({
      next: (message) => {
        // @ts-ignore
        this.existingStops = message.map(stop => stop.stop_code);
        console.log(this.existingStops);
      },
      error: (e) => {
        this.existingStops = [];
      }
    });
    this.addStopForm = this.formbuilder.group({
      stopCode: [''],
      stopName: [''],
      latitude: [''],
      longitude: ['']
    })
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
   * @ignore
   */
  refreshValidity() {
    let temp = true;
    Object.entries(this.validities).forEach(
      // @ts-ignore
      ([key, value]) => {
        if(!value) {temp = false;}
      }
    )
    this.valid = temp;
  }

  /**
   * Validity check for stop code. Fails if either code field is empty or duplicate.
   */
  validateStopCode(event: any) {
    const stopCode = this.addStopForm.get("stopCode")?.value;
    this.validities['codeNotEmpty'] = (stopCode.length > 0);
    if (this.validities['codeNotEmpty']) {
      this.validities['codeNumber'] = !isNaN(+stopCode);
      if (this.validities['codeNumber']) {
        this.validities['codeNotDuplicate'] = (this.existingStops.indexOf(+stopCode) == -1)
      }
      else {
        this.validities['codeNotDuplicate'] = true;
      }
    }
    else {
      this.validities['codeNumber'] = true;
      this.validities['codeNotDuplicate'] = true;
    }
    this.refreshValidity();
  }

  /**
   * Validity check for stop name. Fails if name field is empty.
   */
  validateStopName(event: any) {
    const stopName = this.addStopForm.get("stopName")?.value;
    this.validities['name'] = (stopName.length > 0);
    this.refreshValidity();
  }

  /**
   * Validity check for latitude. Fails if latitude field does not meet regex requirements.
   */
  validateLatitude(event: any) {
    const latitude = this.addStopForm.get("latitude")?.value;
    const reg = new RegExp("^-?([0-8]?[0-9]|90)(\\.[0-9]{1,10})?$");
    if(reg.exec(latitude)) {
      this.validities['lat'] = true;
    }
    else {
      this.validities['lat'] = false;
    }
    this.refreshValidity();
  }

  /**
   * Validity check for longitude. Fails if longitude field does not meet regex requirements.
   */
  validateLongitude(event: any) {
    const longitude = this.addStopForm.get("longitude")?.value;
    const reg = new RegExp("^-?([0-9]{1,2}|1[0-7][0-9]|180)(\\.[0-9]{1,10})?$");
    if(reg.exec(longitude)) {
      this.validities['long'] = true;
    }
    else {
      this.validities['long'] = false;
    }
    this.refreshValidity();
  }

  /**
   * Submits request to backend API with given stop code, name, latitude and longitude to complete creation of new bus stop.
   */
  onSubmit() {
    const stop_details = {
        stop_code: this.addStopForm.get("stopCode")?.value,
        stop_name: this.addStopForm.get("stopName")?.value,
        latitude: this.addStopForm.get("latitude")?.value,
        longitude: this.addStopForm.get("longitude")?.value
      }
    this.http.post<any>(this.api.API_URL + "/stops/create", stop_details).subscribe({
      next: (message) => {
        console.log(message);
      },
      error: (e) => {
        console.log(e);
      }
    })
    this.valid = false;
    this.addStopForm.reset()
    this.validities = {
      codeNumber: true,
      codeNotDuplicate: true,
      codeNotEmpty: false,
      name: false,
      lat: false,
      long: false
    }
  }
}
