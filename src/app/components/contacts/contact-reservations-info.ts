import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../models/user';
import {StayDuvetService} from '../../services/stayduvet';
import {Booking} from '../../models/booking';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from "@ngrx/store";
import {getContactById, State} from "../../reducers/index";

@Component({
  selector: 'sd-contact-reservations-info',
  template: `     
    <div fxLayoutAlign="center center" *ngIf="loading" style="padding-top: 15px">
      <mat-spinner  [diameter]="40" [strokeWidth]="4"color="accent"></mat-spinner>
    </div>

    <mat-card class="padding" *ngIf="reservations.length == 0 && !loading" fxFlex="98%" fxLayoutAlign="center center">
      <span style="font-size: small;">No Reservation Found.</span>
    </mat-card>
    
  <div  *ngIf="reservations.length > 0 && !loading" fxLayout="column" fxLayoutGap="10px" fxFlex="98%" style="padding-top: 10px;padding-bottom: 50px">
    <mat-card  class="padding" *ngFor="let reservation of reservations"  (click)="goToReservation(reservation.id)" fxFlex="100%">
      <div fxLayout="row" fxLayoutAlign="space-between"  style="font-size: small;">
        <div fxFlex="30%" fxLayout="row" fxLayoutGap="5px">
          <strong>Check In:</strong>
          <span>{{reservation.start}}</span>
        </div>
        <div fxFlex="30%" fxLayout="row" fxLayoutGap="5px">
          <strong>Check Out:</strong>
          <span>{{reservation.end}}</span>
        </div>
        <div fxFlex="30%" fxLayout="row" fxLayoutGap="5px">
          <strong>Guest Name:</strong>
          <span>{{reservation.guest_full_name}}</span>
        </div>
      </div>
    </mat-card>
  </div>
  
  `,
  styles: [`
    .padding {
      cursor: pointer;
      padding: -10px -10px -10px -10px;
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%);
    }
    
    mat-spinner {
      height: 40px;
      width: 40px;
    }
  `]
})

export class ContactReservationsInfoComponent implements OnInit, OnDestroy{

  @Input() contact: User;
  reservations: Booking[] = [];
  loading = true;
  isAlive = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<State>,
              private service: StayDuvetService)
  {
  }
  ngOnInit()
  {

    this.route.params.subscribe(params => {
      const contactId = +params['id'];
      this.loading = true;
      this.store.select((state) => {
        return getContactById(state,contactId);
      }).takeWhile(() => this.isAlive).subscribe((contact) => {
        this.contact = contact;
        if (this.contact)
        {
          this.service.getContactReservation(this.contact.id).subscribe((reservations) => {
            this.reservations = reservations;
            this.loading = false;
          }, () => {
            this.loading = false;
          });
        }
      });
    });

  }

  goToReservation(reservationId: number) {
    this.router.navigate(['/reservations/'+ reservationId]);
  }
  ngOnDestroy()
  {
    this.isAlive=false;
  }
}
