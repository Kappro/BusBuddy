import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Route, Router, RouterLink, RouterOutlet} from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';

import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import {navItemsDriver, navItemsManager} from './_nav';
import {JwtHelperService} from "@auth0/angular-jwt";
import {timer} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../services/api.service";
import {
  NewDeploymentModalComponent
} from "../../views/driver/_modals/newdeployment/newdeployment.component";
import {
  CancelledDeploymentModalComponent
} from "../../views/driver/_modals/cancelleddeployment/cancelleddeployment.component";

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    IconDirective,
    NgScrollbar,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    DefaultFooterComponent,
    NewDeploymentModalComponent,
    CancelledDeploymentModalComponent
  ]
})
export class DefaultManagerLayoutComponent implements OnInit {
  public navItems = navItemsManager;
  public new = false;

  constructor(private http: HttpClient,
              private api: ApiService,
              private cdr: ChangeDetectorRef,
              private router: Router) {
  }

  ngOnInit() {
    const mgrInt = setInterval(() => {
      if (this.router.url==='/login') {
        clearInterval(mgrInt);
      }
      this.http.get<any>(this.api.API_URL + "/deployments/check_new").subscribe({
        next: (message) => {
          let indexToUpdate = this.navItems.findIndex(item => item.name === 'Requests');
          if (message.message && !this.new) {
            this.navItems[indexToUpdate] = {
              ...this.navItems[indexToUpdate],
              badge: {
                color: 'primary',
                text: 'NEW REQUEST'
              }
            };
            this.new = true;
          } else if (!message.message && this.new) {
            this.navItems[indexToUpdate] = {
              ...this.navItems[indexToUpdate]
            };
            delete this.navItems[indexToUpdate].badge;
            this.new = false;
          }
          this.navItems = [...this.navItems];
          this.cdr.detectChanges();
        }
      })
    }, 1000);
  }

  startInterval() {

  }

  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }
}

@Component({
  selector: 'app-dashboard-driver',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    IconDirective,
    NgScrollbar,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    DefaultFooterComponent,
    NewDeploymentModalComponent,
    CancelledDeploymentModalComponent
  ]
})
export class DefaultDriverLayoutComponent implements AfterViewInit {

  @ViewChild(NewDeploymentModalComponent) newDeploymentNotif!: NewDeploymentModalComponent;
  @ViewChild(CancelledDeploymentModalComponent) cancelledDeploymentNotif!: CancelledDeploymentModalComponent;

  public navItems = navItemsDriver;

  constructor(private http: HttpClient,
              private api: ApiService,
              private cdr: ChangeDetectorRef,
              private router: Router) {
    if(localStorage.getItem("lastStatus")!=="outofscope" ||
    localStorage.getItem("lastStatus")!="Buffer Time") {
      localStorage.setItem("lastStatus", 'outofscope');
    }
  }

  startInterval() {
    const dvrInt = setInterval(() => {
      if (this.router.url==='/login') {
        clearInterval(dvrInt);
      }
      this.http.get<any>(this.api.API_URL + "/drivers/get_current_deployment").subscribe({
        next: (message) => {
          console.log(localStorage.getItem("lastStatus"));
          if(message.deployment.uid!==-1) { // exists
            if(localStorage.getItem("lastStatus")==="outofscope") { // if previously not exist, means must now be buffer time
              localStorage.setItem("lastStatus", 'Buffer Time');
              if(this.router.url!=='/driver/overview') {
                this.newDeploymentNotif.toggleVisibility();
                clearInterval(dvrInt);
              }
            }
            else if(message.deployment.current_status==='Buffer Time') { // if previously buffer time
              localStorage.setItem("lastStatus", 'Buffer Time');
            }
          }
          else {
            if(localStorage.getItem("lastStatus")==='Buffer Time') {
              this.cancelledDeploymentNotif.toggleVisibility();
              clearInterval(dvrInt);
            }
            localStorage.setItem("lastStatus", "outofscope");
          }
        },
        error: (e) => {
          console.log(e);
        }
      })
    }, 1000);
  }

  ngAfterViewInit() {
    this.startInterval();
  }

  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }
}
