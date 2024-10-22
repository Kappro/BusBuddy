import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalContentComponent,
    ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, TableDirective
} from "@coreui/angular";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../../services/api.service";

@Component({
  selector: 'app-addroutemodal',
  standalone: true,
    imports: [
        ButtonCloseDirective,
        ModalBodyComponent,
        ModalComponent,
        ModalContentComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        TableDirective
    ],
  templateUrl: './addroutemodal.component.html',
  styleUrl: './addroutemodal.component.scss'
})
export class AddRouteModalComponent implements OnInit {
  public visible: boolean = false;

  @Output() visibilityChange = new EventEmitter<boolean>();

  constructor(private http: HttpClient,
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
}
