import {Component, Input, OnInit} from '@angular/core';
import {StayDuvetService} from '../../../services/stayduvet';
import {MatDialog, MatDialogRef} from '@angular/material';
import {LastMinuteDiscount} from '../../../models/last-minute-discount';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DiscountRule} from '../../../models/rule';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'sd-create-last-minute-discount',
  template: `
    <sd-modal-popup-layout [title]="title" [print]="true" (printAction)="printButtonClicked()">
      <form fxLayout="column" [formGroup]="lastMinuteDiscountForm"
            fxLayoutGap="10px" style="width: 100%" (ngSubmit)="lastMinuteDiscountForm.valid && saveDiscount()">
        <mat-form-field style="width: 100%;">
          <input matInput formControlName="title" placeholder="Title">
          <mat-error>provide the title for the discount</mat-error>
        </mat-form-field>
        <mat-form-field style="width: 100%;">
          <textarea matInput rows="3" formControlName="description" placeholder="Description"></textarea>
          <mat-error>provide the description for the discount</mat-error>
        </mat-form-field>
        <hr>
        <div fxLayout="row" fxLayoutAlign="space-between center">
          <h2>Rules:</h2>
          <button type="button" mat-raised-button color="primary" (click)="addRule()">Add Rule</button>
        </div>
        <div fxLayout="column" fxLayoutGap="10px" fxLayoutAlign="center start" style="width: 100%">
          <div fxLayout="row" fxLayoutAlign="space-between center" style="width: 92%">
            <span class="heading" style="width: 32%">Property</span>
            <span class="heading" style="width: 32%">Relation</span>
            <span class="heading" style="width: 32%">Value</span>
          </div>
          <div *ngFor="let rule of rules; let i = index" fxLayout="row" fxLayoutAlign="space-between center"
               style="width: 100%">
            <div fxLayout="row" fxLayoutAlign="space-between center" style="width: 92%">
              <mat-form-field  style="width: 32%;">
                <mat-select
                  [(ngModel)]="rule.actor"
                  [ngModelOptions]="{standalone: true}">
                  <mat-option *ngFor="let actor of actors" [value]="actor.slug">
                    {{ actor.title }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field style="width: 32%;">
                <mat-select
                  [(ngModel)]="rule.relation"
                  [ngModelOptions]="{standalone: true}">
                  <mat-option *ngFor="let relation of relations" [value]="relation.slug">
                    {{ relation.title }}
                  </mat-option>
                </mat-select>  
              </mat-form-field>
              
              <mat-form-field style="width: 32%">
                <input matInput [(ngModel)]="rule.value" [ngModelOptions]="{standalone: true}">
              </mat-form-field>
            </div>
            <button *ngIf="rules.length > 1" mat-icon-button type="button" (click)="removeRule(i)">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </div>
        <hr>
        <div fxLayout="row" fxLayoutAlign="space-between center" style="width: 100%">
          <div fxLayout="row" fxLayoutAlign="space-between center" style="width: 32%">
            <strong>Discount for last 3 days</strong>
            <span>{{last_3_days}}%</span>
          </div>
          <div fxLayout="row" fxLayoutAlign="space-between center" style="width: 32%">
            <strong>Discount for last 7 days</strong>
            <span>{{last_7_days}}%</span>
          </div>
          <div fxLayout="row" fxLayoutAlign="space-between center" style="width: 32%">
            <strong>Discount for last 14 days</strong>
            <span>{{last_14_days}}%</span>
          </div>
        </div>
        <div fxLayout="row" fxLayoutAlign="space-between center" style="width: 100%">
          <mat-slider formControlName="last_3_days" [(ngModel)]="last_3_days" style="width: 32%"></mat-slider>
          <mat-slider formControlName="last_7_days" [(ngModel)]="last_7_days" style="width: 32%"></mat-slider>
          <mat-slider formControlName="last_14_days" [(ngModel)]="last_14_days" style="width: 32%"></mat-slider>
        </div>
        <div fxLayout="column" fxLayoutGap="10px" style="width: 100%">
          <div fxLayout="row" fxLayoutAlign="space-between center" style="width: 100%">
            <div fxLayout="column" fxLayoutAlign="space-between center" style="width: 66%">
              <div fxLayout="row" fxLayoutAlign="space-between center" style="width: 100%">
                <div fxLayout="row" fxLayoutAlign="space-between center" style="width: 48%">
                  <strong>Discount for last 21 days</strong>
                  <span>{{last_21_days}}%</span>
                </div>
                <div fxLayout="row" fxLayoutAlign="space-between center" style="width: 48%">
                  <strong>Discount for last 28 days</strong>
                  <span>{{last_28_days}}%</span>
                </div>
              </div>
              <div fxLayout="row" fxLayoutAlign="space-between center" style="width: 100%">
                <mat-slider formControlName="last_21_days" [(ngModel)]="last_21_days" style="width: 49%"></mat-slider>
                <mat-slider formControlName="last_28_days" [(ngModel)]="last_28_days" style="width: 49%"></mat-slider>
              </div>
            </div>
            <div fxLayoutAlign="end center" style="width: 32%;">
              <mat-spinner *ngIf="isSaving" color="accent" [diameter]="24" [strokeWidth]="4"></mat-spinner>
              <button mat-raised-button *ngIf="update" type="button" (click)="lastMinuteDiscountForm.valid && updateDiscount()" [disabled]="isSaving"
                      color="accent" (click)="updateDiscount()">Update
              </button>
              <button mat-raised-button [disabled]="isSaving"
                      *ngIf="!update" type="submit" color="accent">Save
              </button>
            </div>
          </div>
        </div>

      </form>
    </sd-modal-popup-layout>
  `,
  styles: [`
    .heading {
      font-size: large;
      font-weight: bold;
    }

    hr {
      width: 100%;
    }

    mat-spinner {
      width: 24px;
      height: 24px;
    }
  `]
})

export class CreateLastMinuteDiscountComponent implements OnInit {
  @Input() lastMinuteDiscount: LastMinuteDiscount;
  discount: LastMinuteDiscount;
  title: string = 'Add New Last Minute Discount';

  update = false;
  isSaving = false;

  last_3_days;
  last_7_days;
  last_14_days;
  last_21_days;
  last_28_days;

  rules: { actor: string, relation: string, value: any }[];

  actors =
    [{slug: 'room_count', title: 'Room Count'},
      {slug: 'tag', title: 'Tag'},
      {slug: 'city', title: 'City'},
      {slug: 'suitable_for_children', title: 'Suitable for Children'},
      {slug: 'pets_allowed', title: 'Pets Allowed'},
      {slug: 'min_nights', title: 'Minimum Nights'},
      {slug: 'max_nights', title: 'Maximum Nights'},
      {slug: 'base_price', title: 'Base price'},
      {slug: 'instant_book', title: 'Instant Book'},
    ];

  relations =
    [
      {slug: '=', title: 'Equal to'},
      {slug: '>', title: 'More than'},
      {slug: '<', title: 'Less than'},
      {slug: '<>', title: 'Not Equal to'},
    ];

  lastMinuteDiscountForm: FormGroup;

  ngOnInit() {
    if (!isNullOrUndefined(this.lastMinuteDiscount)) {
      this.discount = this.lastMinuteDiscount;
      this.update = true;
    } else {
      this.discount = null;
    }

    // listing.seasonal_min_stays.slice().forEach( minStay =>{
    //   this.minimumStays.push(
    //     {start: (new Date(minStay['start'])).toDateString(),
    //       end: (new Date(minStay['end'])).toDateString(),
    //       length: minStay['length']}
    //   );
    // });

    this.rules = [];
    this.discount ? this.discount.rules.slice().forEach(rule => {
      this.rules.push({
        actor: rule['actor'],
        relation: rule['relation'],
        value: rule['value']
      });
    }) : this.rules = [{actor: '', relation: '', value: 0}];
    this.title = this.discount ? this.discount.title : 'Add New Discount';
    const description = this.discount ? this.discount.description : null;
    this.last_3_days = this.discount ? this.discount.last_3_days : 50;
    this.last_7_days = this.discount ? this.discount.last_7_days : 50;
    this.last_14_days = this.discount ? this.discount.last_14_days : 50;
    this.last_21_days = this.discount ? this.discount.last_21_days : 50;
    this.last_28_days = this.discount ? this.discount.last_28_days : 50;
    this.lastMinuteDiscountForm = new FormGroup({
      title: new FormControl(this.title, [Validators.required]),
      description: new FormControl(description, [Validators.required]),
      last_3_days: new FormControl(this.last_3_days),
      last_7_days: new FormControl(this.last_7_days),
      last_14_days: new FormControl(this.last_14_days),
      last_21_days: new FormControl(this.last_21_days),
      last_28_days: new FormControl(this.last_28_days)
    });
  }

  constructor(private service: StayDuvetService, private dialogRef: MatDialogRef<CreateLastMinuteDiscountComponent>) {
  }

  printButtonClicked() {
  }

  addRule() {
    this.rules.push(Object.assign({}, {actor: '', relation: '', value: 0}));
  }

  removeRule(index) {
    this.rules.splice(index, 1);
  }

  updateDiscount() {
    const data = this.lastMinuteDiscountForm.value;
    data['rules'] = this.rules;
    this.isSaving = true;
    console.log(data);
    this.service.updateSpecialDiscount(this.discount.id, data).subscribe((discount) => {
      this.isSaving = false;
      console.log(discount);
      this.dialogRef.close();
    }, () => {
      this.isSaving = false;
    });
  }

  saveDiscount() {
    const data = this.lastMinuteDiscountForm.value;
    data['rules'] = this.rules;
    this.isSaving = true;
    console.log(data);
    this.service.addSpecialDiscount(data).subscribe((discount) => {
      this.isSaving = false;
      console.log(discount);
      this.dialogRef.close();
    }, () => {
      this.isSaving = false;
    });
  }
}
