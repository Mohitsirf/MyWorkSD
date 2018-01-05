
export class Message {
  id: number;
  thread_id: number;

  source: string;
  type:string;
  content: string;
  sent_on: string;
  automated: boolean;
  sender_id: number;

  is_preapproval: boolean;
  offer: any;

  assignee?: string;

  getOffer(): any {
    return JSON.parse(this.offer);
  }
}
