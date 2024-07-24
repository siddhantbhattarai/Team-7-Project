export interface IHotel {
  id: string;
  hotelName: string;
  image: string;
  branches: IBranch[];
}

export interface IHotelBranch {
  meta: meta;
  rows: IHotelBranchRows[];
}

export interface meta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
}

export interface IHotelBranchRows {
  id: string;
  name: string;
  state: string;
  city: string;
  address: string;
  phone: string;
  poc: string;
  pocPhone: string;
  pocDesignation: string;
  email: string;
  hotelId: string;
  hotel: {
    id: string;
    name: string;
    image: string;
  };
}

export interface IBranch {
  branchName: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  poc: string;
  pocPhone: string;
  pocDesignation: string;
  email: string;
}

export interface ILodgeBranch {
  meta: meta;
  rows: ILodgeBranchRows[];
}

export interface ILodge extends Omit<IHotel, 'hotelName'> {
  lodgeName: string;
}

export interface ILodgeBranchRows extends Omit<IHotelBranchRows, 'hotel' | 'hotelId'> {
  lodge: {
    id: string;
    name: string;
    image: string;
  };
  lodgeId: string;
}


export interface IHotelTableFilters {
  name: string;
}

export type IHotelTableFilterValue = string | string[];