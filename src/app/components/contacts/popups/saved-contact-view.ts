
import {Component, OnInit} from '@angular/core';
@Component({
  selector: 'sd-saved-contact-view-popup',
  template: `
    <div fxLayout="column" fxFlex="100%">
      <div fxLayout="row" fxFlex="100%" id="titleBar">
        <div fxFlex="50%">
          <h3> Guest : John Davis</h3>
        </div>
        <div fxLayoutAlign="end center" fxLayoutGap="20px" fxFlex="50%">
          <i class="material-icons">close</i>
        </div>
      </div>
      <div fxFlex="100%" fxLayoutAlign="start center" fxLayoutWrap fxLayoutGap="20px" class="content">
        <table fxLayoutGap="20px">
          <tr>
            <th>Name</th>
            <td>John Davis</td>
          </tr>
          <tr>
            <th>Phone</th>
            <td>555 77 854</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>Johndavis@gmail.com<br/>Johndavis@outlook.com</td>
          </tr>
          <tr>
            <th>Source</th>
            <td>Airbnb</td>
          </tr>
          <tr>
            <th>Listing</th>
            <td>Example Listing</td>
          </tr>
          <tr>
            <th>Type</th>
            <td>Guest</td>
          </tr>
          <tr>
            <th>Category</th>
          </tr>
          <tr>
            <th>Reservation(s)</th>
            <td>@86887090<br/>@sv678790</td>
          </tr>
        </table>  
        </div>
      <div fxLayout="row" fxLayoutAlign="end center">
        <button mat-button color="accent" [disabled]="true">EDIT</button>
        <button mat-button color="accent">SAVE</button>
      </div>
    </div>

  `,
  styles: [`
    #titleBar{
      padding: 5px;
      background-color:dodgerblue;
    }
    .content{
      height: 200px;
      padding: 10px;
      margin-top: 20px;
    }
    th{
      text-align: left;
      margin-right: 20%;
    }
    td{
      text-align: left;
    }
    table{
      width: 100%;
      height: 70%;
    }

  `]
})

export class SavedContactViewPopupComponent implements OnInit {

  ngOnInit() {
  }
}
