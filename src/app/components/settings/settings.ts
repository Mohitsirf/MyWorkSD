import {Component} from '@angular/core';

@Component({
  selector: 'sd-setting-screen-content',
  template: `
    <sd-owner-main-layout>
      <div fxLayout="column" fxFlex="100%" class="requiredHeight main-container" fxLayoutAlign="center stretch"
           fxLayoutGap="20px">
        <div fxLayout="column">
          <div fxLayoutAlign="space-between center">
            <div fxLayout="column" fxLayoutAlign="center start" fxLayoutGap="10px" fxFlex="70%">
              <span style="font-size: 25px; font-weight: bolder">Settings</span>
            </div>
          </div>
          <hr id="line">
        </div>
        <nav fxLayout="row" color="accent" mat-tab-nav-bar>
          <a mat-tab-link
             *ngFor="let tab of tabs"
             color="accent"
             [routerLink]="tab.url"
             routerLinkActive #rla="routerLinkActive"
             fxFlex="12.5%"
             [active]="rla.isActive">
            {{tab.title}}
          </a>
        </nav>
        <div style="margin: 20px;">
          <router-outlet></router-outlet>
        </div>
      </div>
    </sd-owner-main-layout>`,
  styles: [`
    .main-container {
      margin: 30px;
      margin-top: 10px;
    }
    
    nav {
      width: 100%;
    }

  `]
})
export class SettingsComponent {

  tabs = [
    {title: 'TOOLS', url: 'tools'},
    {title: 'INTEGRATIONS', url: 'integrations'},
    {title: 'CHANNELS', url: 'channels'},
    {title: 'CLIENTS', url: 'clients'}
  ];
}
