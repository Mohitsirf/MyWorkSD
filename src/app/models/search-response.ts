
import {Listing} from "./listing";
import {User} from './user';

export class SearchResponse {
  users?: User[];
  properties?: Listing[];
}
