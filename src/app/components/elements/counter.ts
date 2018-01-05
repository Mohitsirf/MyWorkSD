import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
/**
 * Created by piyushkantm on 02/07/17.
 */

@Component({
  selector: 'sd-counter',
  template: `
    {{_prefix}}{{num | numberToCurrency:''}}{{_suffix}}
  `,
  styles: []
})
export class CounterComponent implements OnInit,OnDestroy {

  @Output() counToChange = new EventEmitter<any>();
  private _timer;
  private _duration: number;
  private _countTo: number;
  private _countFrom: number;
  private _step: number;
  num: number=0;
  _suffix: any;
  _prefix: any;
  private isAlive:boolean = true;

  ngOnInit(): void {
    console.log('onInit sd-counter');
  }

  constructor() {
   this.counToChange.takeWhile(()=>this.isAlive).subscribe(current => {
      this.num = parseInt(current);
    });
  }

  @Input()
  set suffix(suffix) {
    this._suffix = suffix;
  }

  @Input()
  set prefix(prefix) {
    this._prefix = prefix;
  }


  @Input()
  set duration(duration) {
    this._duration = parseFloat(duration);
    this.run();
  }

  @Input()
  set countTo(countTo) {
    this._countTo = parseFloat(countTo);
    this.run();
  }

  @Input()
  set countFrom(countFrom) {
    this._countFrom = parseFloat(countFrom);
    this.run();
  }

  @Input()
  set step(step) {
    this._step = parseFloat(step);
    this.run();
  }

  run() {
    const that = this;
    clearInterval(that._timer);

    if (isNaN(that._duration)) {
      console.log('[sd-counter] duration is not a number');
      return false;
    }

    if (isNaN(that._step)) {
      console.log('[sd-counter] step is not a number');
      return false;
    }

    if (isNaN(that._countFrom)) {
      console.log('[sd-counter] countFrom is not a number');
      return false;
    }

    if (isNaN(that._countTo)) {
      console.log('[sd-counter] countTo is not a number');
      return false;
    }

    if (that._step <= 0) {
      console.log('[sd-counter] step must be greater than 0.');
      return false;
    }

    if (that._duration <= 0) {
      console.log('[sd-counter] duration must be greater than 0.');
      return false;
    }

    if (that._step > that._duration * 1000) {
      console.log('[sd-counter] step must be equal or smaller than duration.');
      return false;
    }

    let intermediate = that._countFrom;
    const increment = Math.abs(that._countTo - that._countFrom) / ((that._duration * 1000) / that._step);

    that.counToChange.emit(intermediate);

    that._timer = setInterval(function () {
      if (that._countTo < that._countFrom) {
        if (intermediate <= that._countTo) {
          clearInterval(that._timer);
          that.counToChange.emit(that._countTo);
        } else {
          that.counToChange.emit(intermediate);
          intermediate -= increment;
        }
      } else {
        if (intermediate >= that._countTo) {
          clearInterval(that._timer);
          that.counToChange.emit(that._countTo);
        } else {
          that.counToChange.emit(intermediate);
          intermediate += increment;
        }
      }
    }, that._step);
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
