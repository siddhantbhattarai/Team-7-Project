import { IUserItem } from './user';

export interface IVehicleItem {
  id: string;
  model: string;
  image: string;
  number: string;
}

export interface IVehicleTableFilters {
  name: string;
}

export type IVehicleTableFilterValue = string | string[];

export interface IVehicleBookingRows {
  id: string;
  date: string;
  comment: string;
  status: string;
  vehicle: IVehicleItem;
  driver: IUserItem;
}
