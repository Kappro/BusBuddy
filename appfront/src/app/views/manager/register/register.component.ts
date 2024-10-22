import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import {ApiService} from "../../../services/api.service";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {Access} from "../../../_models/account";
import {firstValueFrom} from "rxjs";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
  imports: [ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, FormsModule, ReactiveFormsModule]
})
export class RegisterComponent {
  repeat_password = false;
  success = false;
  register: FormGroup;

  constructor(private auth: AuthService, private api: ApiService, private formbuilder: FormBuilder) {
    this.repeat_password = false;
    this.success = false;
    this.register = this.formbuilder.group({
      username: '',
      email: '',
      contact: 0,
      password: '',
      confirm_password: ''
    })
  }

  async onSubmit() {
    if(this.register.value.password != this.register.value.confirm_password) {
      this.repeat_password = true;
      return;
    }
    else {
      const user_details = {
        name: this.register.value.username,
        email: this.register.value.email,
        contact: this.register.value.contact,
        password: this.register.value.password,
        type: Access.DRIVER
      }
      await firstValueFrom(this.auth.register(user_details))
      this.repeat_password = false;
      this.success = true;
      this.register.reset()
    }
  }
}
