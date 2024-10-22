import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly HOST: string = "localhost";
  private readonly PORT: string = "8080";
  readonly API_URL: string = `http://${this.HOST}:${this.PORT}/api`
}

