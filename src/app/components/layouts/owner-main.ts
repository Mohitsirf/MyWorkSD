import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {State, getAppIsMenuHidden} from "../../reducers/index";
import {isNullOrUndefined} from 'util';

/**
 * Created by piyushkantm on 03/07/17.
 */

@Component({
  selector: 'sd-owner-main-layout',
  template: `
    <sd-layout  style="overflow-x: hidden">     
      <div id="main_content" fxLayout="row" fxLayoutGap="10px" fxFlex="{{fullWidth}}">
        <div fxFlex="{{sidebarWidth}}" class="accent-background">
       
          <sd-owner-sidebar >
       
          </sd-owner-sidebar>
        </div>
        <div fxFlex="{{contentWidth}}">
          <ng-content ></ng-content>
        </div>
      </div>
    </sd-layout>
  `,
  styles: []
})
export class LayoutOwnerMainComponent implements OnInit {

  sidebarWidth : string;
  fullWidth : string;
  contentWidth: string;

  main_contentWidth: number;
  // checked : boolean;

  constructor(private store: Store<State>){
  }

  ngOnInit(): void {
    console.log('onInit sd-owner-main-layout');

    if (!isNullOrUndefined(document.getElementById('main_content'))) {
      this.main_contentWidth = document.getElementById('main_content').offsetWidth;
    }

    this.store.select(getAppIsMenuHidden).subscribe((value) => {
      if(value){
        this.sidebarWidth = '50px';
        this.fullWidth = "100%";
        this.contentWidth = this.main_contentWidth - 60 + 'px';
      } else {
        this.sidebarWidth = '250px';
        this.fullWidth = "96%";
        this.contentWidth = this.main_contentWidth - 260 + 'px';
      }
    });
  }
}
