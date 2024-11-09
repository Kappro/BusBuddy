import { Component } from '@angular/core';
import { FooterComponent } from '@coreui/angular';

/**
 * The common footer component for all logged-in users.
 */
@Component({
    selector: 'app-default-footer',
    templateUrl: './default-footer.component.html',
    styleUrls: ['./default-footer.component.scss'],
    standalone: true,
})
export class DefaultFooterComponent extends FooterComponent {
  /**
   * @ignore
   */
  constructor() {
    super();
  }
}
