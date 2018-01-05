import {Component, Input, OnInit} from '@angular/core';
import {MinimumStay} from '../../models/minimum-stay';
import {StayDuvetService} from '../../services/stayduvet';
import {MatDialog, MatDialogRef} from '@angular/material';
import {CreateMinStayTemplatePopup} from './create-min-stay-template-popup';

@Component({
  selector: 'sd-settings-minimum-stay-template',
  template: `
    <mat-card (click)="editTemplate(item)"  style="cursor: pointer">
      <mat-card-content>
        <div fxLayout="row" fxLayoutAlign="space-between center"  style="font-size: small;">

          <div  fxFlex="30%">
            <span style="font-weight: bold">Start Date : </span>
            <span>{{item.start | date:'mediumDate'}}</span>
          </div>

          <div fxFlex="30%">
            <span style="font-weight: bold">End Date : </span>
            <span>{{item.end | date:'mediumDate'}}</span>
          </div>

          <div fxFlex="30%">
            <span style="font-weight: bold">Minimum No of Days : </span>
            <span>{{item.length}}</span>
          </div>

        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .mat-card {
      border: 1px solid lightgrey !important;
      box-shadow: none !important;
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%);
    }


    mat-spinner {
      width: 30px;
      height: 30px;
    }
  `]
})

export class MinimumStaysTemplateDetailComponent implements OnInit {
  @Input()  item: MinimumStay;
  private dialogRef:MatDialogRef<any>;



  constructor( private service: StayDuvetService,
               private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  editTemplate(template:MinimumStay)
  {

    this.dialogRef = this.dialog.open(CreateMinStayTemplatePopup);
    const instance = this.dialogRef.componentInstance;
    instance.templateId = template.id;
    instance.start = template.start;
    instance.end = template.end;
    instance.popUpTitle = "Edit Min Stays Template";
    instance.isEditType = true;
    instance.length =  template.length;
    this.dialogRef.updateSize('100%');
  }


}
