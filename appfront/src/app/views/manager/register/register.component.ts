import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import {ApiService} from "../../../services/api.service";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {Access} from "../../../_models/account";
import {firstValueFrom} from "rxjs";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
  imports: [ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, FormsModule, ReactiveFormsModule, NgIf]
})
export class RegisterComponent {
  public repeat_password = false;
  public validities = {
    'username': false,
    'email': false,
    'contact': false,
    'repeat_password': false,
    'empty_password': false
  }
  public valid = false;
  public success = false;
  public register: FormGroup;

  constructor(private auth: AuthService, private api: ApiService, private formbuilder: FormBuilder) {
    this.validities = {
      'username': false,
      'email': false,
      'contact': false,
      'repeat_password': false,
      'empty_password': false
    }
    this.valid = false;
    this.success = false;
    this.register = this.formbuilder.group({
      username: '',
      email: '',
      contact: '',
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
      await firstValueFrom(this.auth.register(user_details));
      this.repeat_password = false;
      this.success = true;
      this.valid = false;
      this.register.reset()
      this.validities = {
        'username': false,
        'email': false,
        'contact': false,
        'repeat_password': false,
        'empty_password': false
      }
    }
  }

  checkValidity() {
    let temp = true;
    Object.entries(this.validities).forEach(
      // @ts-ignore
      ([key, value]) => {
        if(!value) {temp = false;}
      }
    )
    return temp;
  }

  validateUsername(event: any) {
    this.validities['username'] = (this.register.get('username')?.value.length > 0);
    this.valid = this.checkValidity();
  }

  validateContact(event: any) {
    this.validities['contact'] = !isNaN(+this.register.get('contact')?.value);
    this.valid = this.checkValidity();
  }

  validateEmail(event: any) {
    let input = this.register.get('email')?.value;
    this.validities['email'] = input.includes("@") && (input.includes(".com") || input.includes(".net"));
    this.valid = this.checkValidity();
    console.log(this.valid)
  }

  validateRepeatPassword(event: any) {
    this.validities['repeat_password'] = (this.register.get('password')?.value == this.register.get('confirm_password')?.value);
    this.validities['empty_password'] = (this.register.get('password')?.value.length > 0);
    this.valid = this.checkValidity();
  }
}
