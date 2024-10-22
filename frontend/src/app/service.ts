import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class BusBuddyService {
  private readonly HOST: string = "localhost";
  private readonly PORT: string = "8080";

  constructor(private _http: HttpClient) { }

  get(route: string) {
    let HOST = "localhost";
    let PORT = "8080";
    return this._http.get("http://"+HOST+":"+PORT+"/"+route);
  }
}
