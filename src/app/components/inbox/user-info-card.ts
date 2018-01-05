import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../models/user';
import {Router} from "@angular/router";

@Component({
  selector: 'sd-user-info-card',
  template: `

    <div class="card" fxLayout="column" fxLayoutGap="10px" (click)="openGuest()" style="cursor: pointer" fxFlex="99%">
      <div fxLayout="column" fxLayoutAlign="space-around center">
        <div fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="20px" style="width: 100%">
          <div fxLayout="column" fxFlex="25%" fxLayoutAlign="center center">
            <div class="avatar-container">
              <img style="height: 100%;width: 100%" [src]="guest.pic_thumb_url"
                   onerror="src='/assets/images/avatar-placeholder.png'"/>
            </div>
          </div>
          <div fxLayout="column" fxFlex="75%" fxLayoutAlign="center start">
            <span *ngIf="guest.last_name">{{ guest.first_name + ' ' + guest.last_name}}</span>
            <span *ngIf="!guest.last_name">{{ guest.first_name}}</span>
            <span>{{ guest.guest.data.verifications.length }}  Verifications</span>
          </div>
        </div>
      </div>

      <span>{{ guest.guest.data.location }}</span>
      <span>{{ guest.phone_number}}</span>
      <span *ngIf="guest.secondary_phone_number">{{ guest.secondary_phone_number}}</span>
      <span >{{ guest.email}}</span>
      <span *ngIf="guest.secondary_email" style="font-size: xx-small">{{ guest.secondary_email}}</span>
    </div>

  `,
  styles: [`
    .card {
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
      transition: 0.3s;
      background: #ffffff;
      padding: 12px;
      border: 1px solid lightgrey;
    }

    p {
      word-break: break-all
    }

    .name-para {
      font-weight: bolder;
      font-size: 15px;
      margin-bottom: 4px;
    }

    span {
      font-family: 'Roboto', sans-serif !important;
      letter-spacing: 2px !important;      
      color: #13304b;
      font-size: small;
      font-weight: 300 !important;
      word-wrap: break-word;
    }

    .verifications-para {
      margin-top: 4px;
      font-size: 13px;
      color: gray;
      font-weight: lighter;
    }

    .avatar-container {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #f3f3f3;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }

    .card > p {
      font-size: 14px !important;
      font-weight: bold;
    }

    .avatar {
      margin-top: 10px;
      height: 50px;
      width: 50px;
    }
  `]
})

export class UserInfoCardComponent implements OnInit {
  @Input() guest: User;

  ngOnInit(): void {
    console.log('OnInit sd-user-info-card');
  }

  constructor(private router:Router)
  {

  }

  openGuest()
  {
    this.router.navigate(['/contacts',this.guest.id]);
  }
}
