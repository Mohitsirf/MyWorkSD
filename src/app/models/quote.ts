import {Listing} from "./listing";
import {Prospect} from "./prospect";
import {User} from "./user";
import {isNullOrUndefined} from "util";

export class Quote {
  id: number;
  property_id: number;
  prospect_id: number;

  created_at: string;

  check_in: string;
  check_out: string;

  subtotal: number;
  source: string;
  total_tax: number;

  security_deposit_fee: number;
  base_amount: number;
  cleaning_fee: number;
  other_fee: { extra_guest_fee: number, pet_fee: number };

  tax_rate: number;
  commission_rate: number;

  prospect: any;

  //
  guest_channel_fee: number;
  cc_process_fee: number;
  amount_to_pay: number;
  subtotal_amount: number;

  is_converted: boolean;


  getProperty(): Listing {
    if(isNullOrUndefined(this['property']['data'])){
      return null;
    }

    return Object.assign(new Listing(),this['property']['data']);
  }

  getProspect(): Prospect {
    return this['prospect']['data'];
  }

  getGuest(): User {
    return this.getProspect()['guest']['data'];
  }


  payableAmount(): number {
    let total = this.base_amount + this.cleaning_fee + this.security_deposit_fee;

    if (this.other_fee.extra_guest_fee) {
      total += this.other_fee.extra_guest_fee;
    }

    if (this.other_fee.pet_fee) {
      total += this.other_fee.pet_fee;
    }

    return total;
  }

  serviceFee(percent: number = 7): number {
    return (this.payableAmount()) * percent / 100;
  }

  ccProcessFee(percent: number = 3): number {
    return (this.payableAmount()) * percent / 100;
  }

  taxes(percent: number = 20): number {
    return (this.payableAmount() + this.serviceFee() + this.ccProcessFee()) * this.tax_rate / 100;
  }

  total(): number {
    return this.payableAmount() + this.serviceFee() + this.ccProcessFee() + this.taxes();
  }
}
