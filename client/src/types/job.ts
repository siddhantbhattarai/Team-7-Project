// ----------------------------------------------------------------------

export type IJobFilterValue = string | string[];

export type IJobFilters = {
  roles: string[];
  experience: string;
  locations: string[];
  benefits: string[];
  employmentTypes: string[];
};

// ----------------------------------------------------------------------

export type IJobCandidate = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IJobCompany = {
  name: string;
  logo: string;
  phoneNumber: string;
  fullAddress: string;
};

export type IJobSalary = {
  type: string;
  price: number;
  negotiable: boolean;
};
type Status = 'ACTIVE' | 'INACTIVE';
export interface IJobVacancy {
  id: string;
  title: string;
  body: string;
  status: Status;
  employmentTypes: string[];
  experience: string;
  role: string;
  skills: string[];
  workSchedule: string[];
  location: string[];
  expiryDate: Date;
  salary: {
    type: string;
    price: number;
    negotiable: boolean;
  };
  salaryNegotiable: boolean;
  benefits: string[];
  isPublished: boolean;
  jobApplications: IJobApplication[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    JobApplication: number;
  };
}

export interface IJobApplication {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  skills: string[];
  profile?: string;
  summary?: string;
  yearsOfExperience?: string;
  jobVacancyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IJobItem = {
  id: string;
  role: string;
  title: string;
  content: string;
  publish?: string;
  createdAt: Date;
  skills: string[];
  expiredDate: Date;
  totalViews: number;
  experience: string;
  salary: IJobSalary;
  benefits: string[];
  locations: string[];
  company?: IJobCompany;
  employmentTypes: string[];
  workingSchedule: string[];
  candidates?: IJobCandidate[];
};
