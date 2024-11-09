import {AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, signal, ViewChild} from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import {
  BorderDirective,
  CardHeaderComponent,
  ContainerComponent,
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
  TabDirective,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  BadgeModule,
  CardSubtitleDirective,
  CardTitleDirective,
  CardTextDirective,
  AlignDirective,
  ModalComponent,
  ModalDialogComponent,
  ModalContentComponent, ModalHeaderComponent, ModalBodyComponent
} from '@coreui/angular';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../services/api.service";
import {cilAlignCenter} from "@coreui/icons";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {ChangeDriverModalComponent} from "../_modals/changedrivermodal/changedrivermodal.component";
/**
 * @ignore
 */
interface IRequest {
  deployment_uid: number,
  service_number: string,
  driver_uid: string,
  driver_name: string,
  bus_license_plate: string,
  datetime_start: string,
  current_status: string
}

/**
 * View component for manager to manage new deployments.
 */
@Component({
    selector: 'app-request',
    templateUrl: './request.component.html',
    styleUrls: ['./request.component.scss'],
    standalone: true,
  imports: [BorderDirective, CardHeaderComponent, ContainerComponent, RowComponent,
    ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent,
    InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, TabDirective,
    TabPanelComponent, TabsComponent, TabsContentComponent, TabsListComponent, BadgeModule, CardSubtitleDirective,
    CardTitleDirective, CardTextDirective, AlignDirective, NgIf, ModalComponent, ModalDialogComponent, ModalContentComponent, ModalHeaderComponent, ModalBodyComponent, ReactiveFormsModule, ChangeDriverModalComponent]
})
export class RequestComponent implements OnInit {
  /**
   * @ignore
   */
  // @ts-ignore
  public requests: any[];
  /**
   * View can employ change driver modal.
   */
  @ViewChild(ChangeDriverModalComponent) changeDriverModal!: ChangeDriverModalComponent;
  /**
   * @ignore
   */
  public isChangingDriver: boolean = false;
  /**
   * @ignore
   */
  public new = false;

  /**
   * View loads in new deployments on construct.
   */
  constructor(private http: HttpClient,
              private api: ApiService,
              private router: Router,
              private cdr: ChangeDetectorRef) {
    this.http.get<any>(this.api.API_URL+"/deployments/get_new").subscribe({
      next: (message) => {
        this.requests = message;
        console.log("Length="+this.requests.length);
      },
      error: (e) => {
        this.requests = [];
      }
    });
  }

  /**
   * Start clock that constantly checks if new deployments come through.
   */
  onClock() {
    const reqTimer = setInterval(() => {
      if (this.router.url==='/login') {
        clearInterval(reqTimer);
      }
      this.http.get<any>(this.api.API_URL + "/deployments/check_new").subscribe({
        next: (message) => {
          if (message.message !== this.new) {
            this.new = message.message;
            this.http.get<any>(this.api.API_URL+"/deployments/get_new").subscribe({
              next: (message) => {
                this.requests = message;
                console.log("Length="+this.requests.length);
                clearInterval(reqTimer);
                this.refresh();
              },
              error: (e) => {
                this.requests = [];
              }
            });
          }
          this.cdr.detectChanges();
        }
      })
    }, 1000);
  }

  /**
   * @ignore
   */
  activeItem = signal(0);

  /**
   * Turns on clock on init.
   */
  ngOnInit() {
    if(this.changeDriverModal) {
      console.log('Modal component is available.')
    }
    this.onClock();
  }

  /**
   * @ignore
   */
  handleActiveItemChange(value: string | number | undefined) {
    this.activeItem.set(<number>value);
  }

  /**
   * Provides functionality to send request to backend API to approve the deployment UID.
   * @param {number} deployment_uid UID of deployment to be approved.
   */
  earlyApproveDeployment(deployment_uid: number) {
    this.http.post<any>(this.api.API_URL+"/deployments/early_approve", {'deployment_uid': String(deployment_uid)}).subscribe({
      next: (message) => {
        console.log(message);
        this.http.get<any>(this.api.API_URL+"/deployments/get_new").subscribe({
          next: (message) => {
            this.requests = message;
            this.refresh();
          },
          error: (e) => {
            this.requests = [];
          }
        });
      },
      error: (e) => {
        console.log("Early Approval failed with "+e);
      }
    })
  }

  /**
   * Provides functionality to send request to backend API to reject the deployment UID.
   * @param {number} deployment_uid UID of deployment to be rejected.
   */
  cancelDeployment(deployment_uid: number) {
    this.http.post<any>(this.api.API_URL+"/deployments/cancel", {'deployment_uid': String(deployment_uid)}).subscribe({
      next: (message) => {
        console.log(message);
        this.http.get<any>(this.api.API_URL+"/deployments/get_new").subscribe({
          next: (message) => {
            this.requests = message;
            this.refresh();
          },
          error: (e) => {
            this.requests = [];
          }
        });
      },
      error: (e) => {
        console.log("Cancel Deployment failed with "+e);
      }
    })
  }

  /**
   * Opens change driver modal, loading in UID of deployment to change driver for.
   * @param deployment_uid UID of deployment to change driver for.
   */
  openChangeDriver(deployment_uid: number) {
    if(this.changeDriverModal) {
      this.http.post<any>(this.api.API_URL + "/deployments/get_by_uid", {'deployment_uid': String(deployment_uid)}).subscribe({
        next: (message) => {
          this.changeDriverModal.deployment = message;
          console.log(this.changeDriverModal.deployment);
          this.isChangingDriver = true;
          this.changeDriverModal.toggleVisibility()
          console.log(this.changeDriverModal.visible)
        },
        error: (e) => {
          this.requests = [];
        }
      });
    } else {
      console.error("Modal component is not initialised");
    }
  }

  /**
   * Refreshes component without needing to reload. Temporarily pause clock if it is on, then restarts the clock after reloading.
   */
  refresh() {
    setTimeout(() => {this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
      this.router.navigate([this.router.url]).then(()=>{
        this.http.get<any>(this.api.API_URL+"/deployments/get_new").subscribe({
          next: (message) => {
            this.requests = message;
            console.log("Length="+this.requests.length);
          },
          error: (e) => {
            this.requests = [];
          }
        });
        console.log(`Refreshing ${this.router.url}`)
        this.onClock();
      })
    })}, 1000)
  }
}
