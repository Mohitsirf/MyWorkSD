import {Expense} from './expense';

export class AutoTask {
  id: number;
  assignee_type: string;
  title: string;
  is_complete: string;
  description: string;

  offset: number;
  offset_position: string;
  offset_reference: string;
  expenses: Expense[];
  property_ids: number[];
}
