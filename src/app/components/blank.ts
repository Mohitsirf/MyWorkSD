import {Component} from '@angular/core';

@Component({
  selector: 'sd-blank',
  template: `
  <div fxFlex="100%">
    <router-outlet></router-outlet>
  </div>
  `,
  styles: [``]
})

export class BlankComponent {
}
