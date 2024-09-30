import { Item } from './types';

export interface UserIdPayload {
  user_id: string;
}
export interface UserIdItemPayload {
  user_id: string;
  item: Item;
}

export interface UserIdItemIdPayload {
  user_id: string;
  item_id: string;
}

export interface UserIdItemIdItemPayload {
  user_id: string;
  item_id: string;
  updatedItem: Item;
}

export interface RemoveTaskAction {
  type: string;
  payload: Response;
}
