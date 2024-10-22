import {Component, AfterViewInit, signal, OnInit} from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { RouterLink } from '@angular/router';
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
  CardTitleDirective, CardSubtitleDirective, CardTextDirective
} from '@coreui/angular';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../services/api.service";

@Component({
    selector: 'app-busroutes',
    templateUrl: './busroutes.component.html',
    styleUrls: ['./busroutes.component.scss'],
    standalone: true,
  imports: [RouterLink, TabPanelComponent, TabDirective, BadgeModule,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent, BorderDirective, CardHeaderComponent, ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, CardTitleDirective, CardSubtitleDirective, CardTextDirective]
})
export class BusRoutesComponent implements OnInit {

  public services: any[] = [];
  public stops: any[] = [];

  activeItem = signal(0);

  handleActiveItemChange(value: string | number | undefined) {
    this.activeItem.set(<number>value);
  }

  constructor(private http: HttpClient,
              private api: ApiService) { }

  ngOnInit(): void {
    this.http.get<any>(this.api.API_URL + "/stops/get_all").subscribe({
        next: (message) => {
          // @ts-ignore
          this.stops = message;
          console.log(message);
        },
        error: (e) => {
          console.log(e);
        }
      })
    this.http.get<any>(this.api.API_URL + "/services/get_all").subscribe({
        next: (message) => {
          // @ts-ignore
          this.services = message;
          console.log(message);
        },
        error: (e) => {
          console.log(e);
        }
      })
  }

}
