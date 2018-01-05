import {Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter} from '@angular/core';
import {StayDuvetService} from '../../services/stayduvet';
import {isNullOrUndefined, isUndefined} from 'util';
import {Listing} from '../../models/listing';
import {Booking} from '../../models/booking';
import {OwnerBlock} from '../../models/owner-block';
import {getSourceType} from '../../utils';
import {getDateObj} from '../calendar/calendar-utils';
import {Router} from '@angular/router';

@Component({
  selector: 'sd-multi-calendar', template: `
    <mat-grid-list cols="26" *ngIf="loaded">
      <mat-grid-tile
        colspan="8"
        class="List"
        [style.border]="'1px solid #4d4d4d'">
        <span style="">
          <mat-checkbox [(ngModel)]="checked"
                        (change)="selectionChanged($event)">
            <span [matTooltipPosition]="'above'"
                  [matTooltip]="listing.title">{{ listing.title | truncate:'20' }}</span>
          </mat-checkbox>
        </span>
      </mat-grid-tile>
      <mat-grid-tile fxLayout="column" *ngFor="let tile of trimmedTiles"
                     [ngStyle]="{'background': getBackground(tile.startColor, tile.endColor)}"
                     [colspan]="1"
                     class="header"
                     [style.border]="'1.5px solid #1a1a1a'">
        <div *ngIf="tile.reason2 == null && tile.showToolTip"
             style="width: 100%; height: 100%"
             matTooltip="{{tile.showToolTip ? tile.reason : ''}}"
             (click)="navigateToBooking(tile.booking)">
        </div>
        <div *ngIf="tile.showToolTip && tile.reason2 != null "
             style="width: 50%; height: 100%"
             matTooltip="{{tile.showToolTip ? tile.reason : ''}}"
             (click)="navigateToBooking(tile.booking)">
        </div>
        <div *ngIf="tile.showToolTip && tile.reason2 != null "
             style="width: 50%; height: 100%"
             matTooltip="{{tile.showToolTip ? tile.reason2 : ''}}"
             (click)="navigateToBooking(tile.booking2)">
        </div>

      </mat-grid-tile>
    </mat-grid-list>
  `, styles: [`
    .mat-grid-tile:hover {
      cursor: pointer;
      opacity: 0.8;
    }

    /deep/ .mat-figure {
      justify-content: flex-start !important;
      padding-left: 5px !important;
    }

    #qwer {
      max-height: 50px !important;
    }

    hr {
      display: block;
      height: 1px;
      border: 0;
      border-top: 1px solid #ccc;
      margin: 1em 0;
      padding: 0;
    }

    .header:hover {
      background-color: #e1e1e1;
    }

  `]
})
export class MultiCalendarComponent implements OnChanges, OnInit {
  defaultColor = '#f2f2f2';

  colorLog: { [id: number]: string };

  loaded = false;
  viewLoaded = false;

  @Input() listing: Listing;
  @Input() startDate: number;
  @Input() endDate: number;
  @Input() daysInMonth: number;
  @Input() bookings: Booking[];
  @Input() blocks: OwnerBlock[];
  @Input() checked: boolean;
  @Output() onSelectChanged: EventEmitter<any> = new EventEmitter();

  tiles;
  trimmedTiles;

  constructor(private service: StayDuvetService, private router: Router) {
  }

  ngOnInit(): void {
    console.log('onInit sd-multi-calendar');
    console.log(this.blocks);

    this.colorLog = {};
    this.setTiles();
    this.setupBookings();
    this.setupOwnerBlocks();

    this.viewLoaded = true;
    this.loaded = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.viewLoaded) {
      this.setTiles();
      this.setupBookings();
      this.setupOwnerBlocks();
    }
  }

  navigateToBooking(booking) {
    if (booking != null) {
      this.router.navigate(['reservations/' + booking.id]);
    }
  }

  setupOwnerBlocks() {
    const color = '#000000';

    for (const block of this.blocks) {
      const date = getDateObj(block.date);
      this.tiles[date.getDate() - 1].startColor = color;
      this.tiles[date.getDate()].endColor = color;

      this.tiles[date.getDate() - 1].showToolTip = true;
      this.tiles[date.getDate()].showToolTip = true;

      if (this.tiles[date.getDate() - 1].reason == null) {
        this.tiles[date.getDate() - 1].reason = block.reason;
      } else {
        this.tiles[date.getDate() - 1].reason2 = block.reason;
      }

      if (this.tiles[date.getDate()].reason == null) {
        this.tiles[date.getDate()].reason = block.reason;
      } else {
        this.tiles[date.getDate()].reason2 = block.reason;
      }

      this.tiles[date.getDate()].isBlock = true;
      this.tiles[date.getDate() - 1].isBlock = true;
    }
  }

  setupBookings() {
    for (const booking of this.bookings) {
      const startDate = getDateObj(booking.start);
      const endDate = getDateObj(booking.end);

      let currentColor = this.getRandomColor(booking);
      if (this.colorLog[booking.id]) {
        currentColor = this.colorLog[booking.id];
      } else {
        this.colorLog[booking.id] = currentColor;
      }

      const today = getDateObj();

      for (let _i = startDate.getDate(); _i <= endDate.getDate(); _i++) {
        let toolTipText = '';
        if (!isNullOrUndefined(booking.guest_full_name)) {
          toolTipText = toolTipText + 'Guest Name : ' + booking.guest_full_name + '\n';
        }
        toolTipText = toolTipText + 'Payout Amount : $' + booking.payout_amount + '\n' + 'Guests: ' + booking.number_of_guests + '\n' + 'Checkout : ' + booking.check_out_time + '\n' + 'Source : ' + getSourceType(booking.source).title;

        if (startDate.getDate() === _i) {
          this.tiles[_i - 1].startColor = currentColor;
          this.tiles[_i - 1].isStart = true;
          this.tiles[_i - 1].reason2 = toolTipText;
          this.tiles[_i - 1].booking2 = booking;
        } else if (endDate.getDate() === _i) {
          this.tiles[_i - 1].endColor = currentColor;
          this.tiles[_i - 1].isEnd = true;
          this.tiles[_i - 1].reason = toolTipText;
          this.tiles[_i - 1].booking = booking
        } else {
          this.tiles[_i - 1].startColor = currentColor;
          this.tiles[_i - 1].endColor = currentColor;
          this.tiles[_i - 1].reason = toolTipText;
          this.tiles[_i - 1].isStart = false;
          this.tiles[_i - 1].isEnd = false;
          this.tiles[_i - 1].booking = booking;
        }

        this.tiles[_i - 1].showToolTip = true;

      }
    }
  }

  setTiles() {
    this.tiles = this.generateTiles();
    this.trimmedTiles = this.tiles.slice(this.startDate - 1, this.endDate);
  }

  generateTiles() {
    const arr = [];
    for (let i = 0; i <= this.daysInMonth; i++) {
      arr.push({
        startColor: this.defaultColor,
        endColor: this.defaultColor,
        showToolTip: false,
        reason: null,
        reason2: null,
        booking: null,
        booking2: null,
        isStart: false,
        isEnd: false,
        isBlock: false
      });
    }

    return arr;
  }

  getRandomColor(booking: Booking) {
    if (booking.payment_method === 'from_platform' && booking.total_paid === 0) {
      return '#f0a340';
    }

    if (booking.is_inspected) {
      return 'green';
    } else if (booking.is_clean) {
      return 'yellow';
    }

    return 'red';
  }

  getBackground(startColor: string, endColor: string): string {
    return '-webkit-linear-gradient(135deg, ' + startColor + ' 50%, ' + endColor + ' 50%)';
  }

  selectionChanged($event) {
    this.onSelectChanged.emit({
      listing: this.listing, checked: $event.checked
    });
  }

}
