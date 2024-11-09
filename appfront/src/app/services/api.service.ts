import {Injectable} from "@angular/core";

/**
 * Provides API URL for queries to BusBuddy API.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  /**
   * Target IP address that API is run on.
   * @private
   */
  private readonly HOST: string = "localhost";
  /**
   * Target port that API is run on.
   * @private
   */
  private readonly PORT: string = "8080";
  /**
   * Full URL string for querying API service.
   */
  readonly API_URL: string = `http://${this.HOST}:${this.PORT}/api`
}

