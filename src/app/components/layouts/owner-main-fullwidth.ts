/**
 * Created by aditya on 24/8/17.
 */
import {Component, OnInit} from '@angular/core';
import {State, getAppIsMenuHidden} from "../../reducers/index";
import {Store} from "@ngrx/store";

@Component({
  selector: 'sd-owner-main-layout-fullwidth',
  template: `
    <sd-layout>
      <div fxLayout="row" fxFlex="100%">
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
export class LayoutOwnerMainFullWidthComponent implements OnInit {

  sidebarWidth : string;

  constructor(private store: Store<State>){
  }

  ngOnInit(): void {
    console.log('onInit sd-owner-main-layout-fullwidth');
    this.store.select(getAppIsMenuHidden).subscribe((value) => {
      if(value){
        this.sidebarWidth = '50px';
      } else {
        this.sidebarWidth = '250px';
      }
    });
  }
}

