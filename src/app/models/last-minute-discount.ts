import {DiscountRule} from './rule';

export interface LastMinuteDiscount {
  id: number;
  title: string;
  description: string;
  rules: DiscountRule[];
  last_3_days: number;
  last_7_days: number;
  last_14_days: number;
  last_21_days: number;
  last_28_days: number;
}
