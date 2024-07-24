import { IHotelBranchRows, ILodgeBranchRows } from './hotel';

export interface IActivity {
  meal: string;
  name: string;
  description: string;
  hotelId: string | null;
  lodgeId: string | null;
  lodge: ILodgeBranchRows | null;
  hotel: IHotelBranchRows | null;
  transfer: string;
}

export interface IFranchise {
  id: string;
  name: string;
  image: string;
}

export interface IPackage {
  id?: string;
  name: string;
  duration: number;
  franchiseId: string;
  description: IActivity[];
}

export interface IPackageRows {
  id: string;
  name: string;
  duration: number;
  franchiseId: string;
  description: {
    activity: IActivity[];
  };
  franchise: IFranchise;
}

export interface IPackageTableFilters {
  name: string;
}

export type IPackageTableFilterValue = string | string[];