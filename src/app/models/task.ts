import {TaskImage} from "./task-image";
import {Expense} from "./expense";

export class Task {
  id: number;
  booking_id: number;
  property_id: number;
  assignee_id: number;
  auto_task_id: number;
  title: string;
  type: string;
  due_date: string;
  due_time: string;
  description: string;
  amount: string;
  status: string;
  is_archived: boolean = false;
  payment_by: string;

  getImages(): TaskImage[]{
    return this['images']['data'];
  }

  getExpenses(): Expense[]{
    return this['expenses']['data'];
  }
}
