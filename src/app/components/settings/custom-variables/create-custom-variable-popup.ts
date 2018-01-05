import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Listing} from '../../../models/listing';
import {StayDuvetService} from '../../../services/stayduvet';
import {MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import {State} from '../../../reducers/index';
import {UpdateSuccessAction} from '../../../actions/listing';
import {SavedMessage} from "../../../models/saved-message";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'sd-listing-canned-message-popup',
  template: `
    <sd-modal-popup-layout title="{{popUpTitle}}">

        <form fxLayout="column" [formGroup]="formGroup" (ngSubmit)="formGroup.valid && saveButtonCLicked()">
          <mat-form-field class="detailField">
            <input type="text" matInput color="accent" formControlName="key"   placeholder="Key">
            <mat-error>This field is required.</mat-error>
          </mat-form-field>
          <mat-form-field class="detailField">
            <textarea rows="2" color="accent" matInput placeholder="Replacement text" formControlName="replacement_text" ></textarea>
            <mat-error>This field is required</mat-error>
          </mat-form-field>
          <div fxLayout="row" fxLayoutAlign="end center" fxLayoutGap="10px">
            <mat-spinner *ngIf="isDeleting || isSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>
            <button *ngIf="isEditType" [disabled]="isSaving || isDeleting" mat-raised-button color="accent" (click)="delete()">Delete</button>
            <button mat-raised-button color="accent" [disabled]="isSaving || isDeleting">{{buttonText}}</button>
          </div>
        </form>
        
        
        
    </sd-modal-popup-layout>
  `,
  styles: [`

    .title {
      font-weight: bolder;
      font-size: 22px;
      padding-left: 10px;
      padding-right: 10px;
      height: 30px;
      width: 100%;
    }

    .detailField {
      padding-left: 10px;
      padding-right: 10px;
      width: 95%;
    }

    textarea {
      resize: vertical;
    }
    
    mat-error{
      font-size: x-small;
    }

    mat-spinner {
      width: 30px;
      height: 30px;
    }

  `]
})

export class CreateCustomVariablePopup implements OnInit {
  @Input() popUpTitle ;
  @Input() id;
  @Input() messageId;
  @Input() key;
  @Input() replacement_text;
  @Input() isEditType=false;
  buttonText;

  formGroup: FormGroup;
  customVariableKey: FormControl;
  customVariableText: FormControl;



  isSaving: Boolean = false;
  isDeleting: Boolean = false;


  constructor(private service: StayDuvetService, private dialog: MatDialog, private store: Store<State>) {
    this.customVariableKey = new FormControl(null, [Validators.required]);
    this.customVariableText = new FormControl(null, [Validators.required]);

    this.formGroup = new FormGroup({
      key: this.customVariableKey,
      replacement_text: this.customVariableText
    });
  }

  ngOnInit() {
    if (this.isEditType)
    {
      this.buttonText="Update";
      this.customVariableKey.setValue(this.key);
      this.customVariableText.setValue(this.replacement_text);
    }
    else {
      this.buttonText="Create";
    }

  }

  saveButtonCLicked() {
    this.isSaving  =true;
    if (this.isEditType)
    {
      this.service.updateCustomVariable(this.id,this.formGroup.value).subscribe(item => {
        this.isSaving=false;
        this.dialog.closeAll();
      }, () => {
        this.isSaving=false;
      });
    }
    else {
      this.service.addNewCustomVariable(this.formGroup.value).subscribe(item => {
        this.isSaving=false;
        this.dialog.closeAll();
      }, () => {
        this.isSaving=false;
      });
    }

  }

  delete()
  {
    this.isDeleting=true;
    this.service.deleteCustomVariable(this.id).subscribe(item => {
      this.isDeleting =false;
      this.dialog.closeAll();
    }, () => {
      this.isDeleting =false;
    });
  }
}
