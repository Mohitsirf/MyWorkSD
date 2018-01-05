/**
 * Created by aditya on 14/10/17.
 */
import {Component, OnInit} from '@angular/core';
import {State, getAppIsMenuHidden} from "../../reducers/index";
import {Store} from "@ngrx/store";

@Component({
  selector: 'sd-owner-main-layout-generic',
  template: `
    <sd-layout>
      <div fxLayout="row" fxFlex="{{fullWidth}}">
        <div fxFlex="{{sidebarWidth}}" class="accent-background">
          <sd-owner-sidebar>
          </sd-owner-sidebar>
        </div>
          <ng-content></ng-content>
      </div>
    </sd-layout>
  `,
  styles: []
})
export class LayoutOwnerMainGenericComponent implements OnInit {

  sidebarWidth : string;
  fullWidth : string;

  constructor(private store: Store<State>){
  }

  ngOnInit(): void {
    console.log('onInit sd-owner-generic-main-layout');
    this.store.select(getAppIsMenuHidden).subscribe((value) => {
      if(value){
        this.sidebarWidth = '50px';
        this.fullWidth = "100%";
      } else {
        this.sidebarWidth = '250px';
        this.fullWidth = "97.5%";
      }
    });
  }
}
