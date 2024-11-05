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

interface IRequest {
  deployment_uid: number,
  service_number: string,
  driver_uid: string,
  driver_name: string,
  bus_license_plate: string,
  datetime_start: string,
  current_status: string
}

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
  // @ts-ignore
  public requests: any[];
  @ViewChild(ChangeDriverModalComponent) changeDriverModal!: ChangeDriverModalComponent;
  public isChangingDriver: boolean = false;
  public new = false;

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

  activeItem = signal(0);

  ngOnInit() {
    if(this.changeDriverModal) {
      console.log('Modal component is available.')
    }
    this.onClock();
  }

  handleActiveItemChange(value: string | number | undefined) {
    this.activeItem.set(<number>value);
  }

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
