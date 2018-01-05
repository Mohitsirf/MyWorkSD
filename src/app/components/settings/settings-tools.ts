import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'sd-setting-tools',
  template: `
    <div fxLayout="column" fxLayoutGap="20px" style="margin-top: 10px; margin-bottom: 50px;width:100%" fxFlex="100%">
      <mat-card fxLayout="column" fxLayoutGap="5px" class="padding" (click)="autoMessage()">
        <h3>Automated Messages</h3>
        <span class="content">Schedule automated messages based on certain triggers. Automate check-in instructions to guests, reminders to cleaners,
      and more. Automated Messages become active once your listing reaches 100%.</span>
      </mat-card>
      <mat-card fxLayout="column" fxLayoutGap="5px" class="padding" (click)="cannedResponses()">
        <h3>Canned Responses</h3>
        <span class="content">Create a canned response.</span>
      </mat-card>
      <mat-card fxLayout="column" fxLayoutGap="5px" class="padding" (click)="massMessage()">
        <h3>Mass Message</h3>
        <span class="content">Mass messages all your guests. Example are for emergencies or for any reason you have to let all your guest know something
      all at once.</span>
      </mat-card>
      <mat-card fxLayout="column" fxLayoutGap="5px" class="padding" (click)="autoReview()">
        <h3>Auto Reviews</h3>
        <span class="content">Automatically leave reviews for your guests from a predefined set of personalized templates.</span>
      </mat-card>
      <mat-card fxLayout="column" fxLayoutGap="5px" class="padding" (click)="autoResponses()">
        <h3>Auto Responses</h3>
        <span
          class="content">Set predefined messages if you are'nt able to respond within a certain amount of time.</span>
      </mat-card>
      <mat-card fxLayout="column" fxLayoutGap="5px" class="padding" (click)="multiCalenderRules()"
               >
        <h3>Multi Unit Calendar Rules</h3>
        <span class="content">Automatically blocks date on one listing based on reservations on a different listing. This enables combo listings.</span>
      </mat-card>
      <mat-card fxLayout="column" fxLayoutGap="5px" class="padding" (click)="autoTasks()">
        <h3>Auto Tasks</h3>
        <span class="content">Schedule task templates to be generated automatically based on certain triggers. Auto task can be used for check in
      procedure.</span>
      </mat-card>
      <mat-card fxLayout="column" fxLayoutGap="5px" class="padding" (click)="dynamicPricing()">
        <h3>Dynamic Pricing</h3>
        <span class="content">We analyze data on a daily basis in each of our individual markets. Our price recommendations are created based off
        three main variables: day of week,seasonality,and local events. After our algorithm creates a competitive daily rate for
      upto 12 months into the future,we push our price recommendations once daily to your Airbnb or vacation rental channel.</span>
      </mat-card>
      <mat-card fxLayout="column" fxLayoutGap="5px" class="padding" (click)="minimumStaysEvents()"
               >
        <h3>Minimum Stays & Events</h3>
        <span
          class="content">Set rules to automatically discount or raise prices to multiple listing all in one click.</span>
      </mat-card>
      <mat-card fxLayout="column" fxLayoutGap="5px" class="padding" (click)="lastMinuteDiscounts()"
               >
        <h3>Last Minute Discounts</h3>
        <span class="content">Create a schedule of last minute discounts offered to property types.</span>
      </mat-card>
      <mat-card fxLayout="column" fxLayoutGap="5px" class="padding" (click)="customVariables()"
               >
        <h3>Custom Variables</h3>
        <span class="content">Create a custom variable</span>
      </mat-card>
      <mat-card fxLayout="column" fxLayoutGap="5px" class="padding" (click)="inventoryProductManagement()"
               >
        <h3>Inventory and Product Management</h3>
        <span class="content">Create a list of product and services so when a task is put in it pulls the correct price and keeps track of your
        inventory and service offerings.</span>
      </mat-card>
    </div>
  `,
  styles: [`
    .padding {
      cursor: pointer;
      padding: -10px -10px -10px -10px;
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%);
    }

    .content {
      font-size: 14px;
      line-height: 130%;
    }

    h3 {
      font-weight: bolder !important;
      letter-spacing: 1px !important;
      font-size: 22px !important;
      font-family: 'Montserrat', sans-serif !important;
    }

    .mat-card {
      border: 1px solid lightgrey !important;
      box-shadow: none !important;
    }

  `]
})
export class SettingsToolsComponent {
  constructor(private router: Router) {
  }

  autoMessage() {
    this.router.navigate(['/settings/tools/automated']);
  }

  massMessage() {
  }

  autoReview() {
  }


  multiCalenderRules() {
  }

  autoTasks() {
    this.router.navigate(['/settings/tools/auto-tasks']);
  }

  dynamicPricing() {
  }

  minimumStaysEvents() {
    this.router.navigate(['/settings/tools/minimum-stays-events']);
  }

  lastMinuteDiscounts() {
    this.router.navigate(['/settings/tools/last-minute-discounts']);
  }

  inventoryProductManagement() {
  }

  customVariables() {
    this.router.navigate(['/settings/tools/custom-variables']);
  }

  cannedResponses()
  {
    this.router.navigate(['/settings/tools/canned-responses']);

  }

  autoResponses()
  {
    this.router.navigate(['/settings/tools/auto-responses']);

  }
}
