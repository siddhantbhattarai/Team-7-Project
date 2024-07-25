import { CustomFile } from 'src/components/upload';

// ----------------------------------------------------------------------

export type IUserTableFilterValue = string | string[];

export type IUserTableFilters = {
  name: string;
  role: string[];
  status: string;
};

// ----------------------------------------------------------------------

export type IUserSocialLink = {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
};

export type IUserProfileCover = {
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IUserProfile = {
  id: string;
  role: string;
  quote: string;
  email: string;
  school: string;
  country: string;
  company: string;
  totalFollowers: number;
  totalFollowing: number;
  socialLinks: IUserSocialLink;
};

export type IUserProfileFollower = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
};

export type IUserProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: Date;
};

export type IUserProfileFriend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IUserProfilePost = {
  id: string;
  media: string;
  message: string;
  createdAt: Date;
  personLikes: {
    name: string;
    avatarUrl: string;
  }[];
  comments: {
    id: string;
    message: string;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      avatarUrl: string;
    };
  }[];
};

interface Address {
  id: string;
  userId: string;
  country: string;
  state: string;
  city: string;
  address: string;
  zipCode: string;
}

interface Professional {
  id: string;
  userId: string;
  companyName: string;
  passportNumber: string;
  passportExpire: string;
  citizenNumber: string;
  guide_license: string;
  nma: string;
  panNumber: string;
}

export interface Role {
  userId: string;
  roleId: string; // Add other role types if needed
}

export type IUserUniqueFields = {
  batch: string[];
  section: string[];
  course: string[];
  tags: string[];
};

export type IUserItem = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  address: string;
  tags: string[];
  section: string;
  batch: string;
  course: string;
  dob: string;
  profileImage: string;
  roles: string[];
};

export type IUserCard = {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  status: string;
  roles: Role[];
  address: Address;
};

export type IUserAccount = {
  email: string;
  isPublic: boolean;
  displayName: string;
  city: string | null;
  state: string | null;
  about: string | null;
  country: string | null;
  address: string | null;
  zipCode: string | null;
  phoneNumber: string | null;
  photoURL: CustomFile | string | null;
};

export type IUserAccountBillingHistory = {
  id: string;
  price: number;
  createdAt: Date;
  invoiceNumber: string;
};

export type IUserAccountChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type IUserGroup = {
  groupId: string;
  clients: IUserItem[];
};

export interface IUserGroupRows {
  id: string;
  groupId: string;
  UsersOnGroup: {
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
      profileImage: string;
      status: string;
      dob: string;
      bankId: string | null;
      accountNumber: string | null;
      designation: string | null;
      roles: Role[];
    };
    rooms?: string | null;
    extension?: string | null;
  }[];
}

export interface ISingleGroup {
  id: string;
  groupId: string;
  UsersOnGroup: IUserOnGroup[];
}

export interface IUserOnGroup {
  user: IUserItem;
  rooms?: string | null;
  extension?: string | null;
}

export interface IGroupTableFilters {
  name: string;
}

export type IGroupTableFilterValue = string | string[];
