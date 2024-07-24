import { IPackageRows, IActivity } from './package';
import { IUserItem } from './user';
import { IHotelBranchRows, ILodgeBranchRows } from './hotel';
import { IVehicleItem } from './vehicle';

export interface IBookingRows {
  id: string;
  date: string;
  status: string;
  meal: string;
  comment: string;
  hotel: IHotelBranchRows | null;
  lodge: ILodgeBranchRows | null;
  hotelId: string | null;
  lodgeId: string | null;
  groupId: string;
  group: {
    id: string;
    groupId: string;
  };
}

export interface IPMSRows {
  id: string;
  groupId: string;
  leaderId: string;
  guideId: string;
  packageId: string;

  customPackage: ICustomPackage[];
  additionalInfo: IAdditionalInfo;

  group: IUserGroup; 
  leader: IUserItem;
  guide: IUserItem;
  package: IPackageRows;
}

export interface IUserGroup {
  id: string;
  groupId: string;
  UsersOnGroup: {
    groupId: string;
    user: IUserItem;
    userId: string;
    rooms?: string | null;
    extension?: string | null;
  }[];
}

export interface ICustomPackage {
  name: string;
  transfer: string;
  bookingId: string;
  description: string;
  transferDetails: ITransferDetails;
  booking: IBookingRows;
}

export interface ICustomActivity extends IActivity {
  date: string;
}

export interface IPMSTableFilters {
  name: string;
}

export type IPMSTableFilterValue = string | string[];

export interface ICreatePMS {
  guideId: string;
  leaderId: string;
  groupId: string;
  packageId: string;
  activities: ICreateCustomPackage[];
  additionalInfo?: IAdditionalInfo;
}

export interface ICreateCustomPackage {
  name: string;
  description: string;
  meal: string;
  date: string;
  hotelId: string | null;
  lodgeId: string | null;
  hotel?: IHotelBranchRows | null;
  lodge?: ILodgeBranchRows | null;
  transfer: string;
  transferDetails?: ITransferDetails;
}

interface ITransferDetails {
  transferType: string;
  to: string;
  from: string;
  driverId?: string;
  hiringCompany?: string;
  vehicleId?: string;
  flightNumber?: string;
  vehicle?: IVehicleItem;
  driver?: IUserItem;
}

export interface IAdditionalInfo {
  flightDetails: IFlightDetails[];
  trekkingArea: string;
}

export interface IFlightDetails {
  type: string;
  date: string;
  flightNumber: string;
  to: string;
  from: string;
  time: string;
}
