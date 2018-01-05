import {Component, Input} from '@angular/core';

@Component({
  selector: 'sd-listing-round-image-card',
  template: `
    <div id="card" fxLayout="column" fxLayoutAlign="center center">
      <img src="{{imgPath}}">
      <span style="font-size: 12px;font-weight: bold"><ng-content></ng-content></span>
    </div>
  `,
  styles: [`
    :host {
      min-width: 150px;
      min-height: 200px;
    }

    #card {
      width: 150px;
      height: 200px;
    }

    img {
      background-color: gray;
      width: 80px;
      height: 80px;
      border-radius: 40px;
    }

    span {
      padding-top: 20px;
    }
  `]
})
export class ListingRoundImageCardComponent {
  @Input() imgPath: string = '../../assets/images/placeholder.jpg';
}
