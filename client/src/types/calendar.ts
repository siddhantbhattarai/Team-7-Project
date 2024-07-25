// ----------------------------------------------------------------------

import { IUserItem } from './user';

export type ICalendarFilterValue = string[] | Date | null;

export type ICalendarFilters = {
  colors: string[];
  startDate: Date | null;
  endDate: Date | null;
};

// ----------------------------------------------------------------------

export type ICalendarDate = string | number;

export type ICalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';

export type ICalendarRange = {
  start: ICalendarDate;
  end: ICalendarDate;
} | null;

export type ICalendarEvent = {
  id: string;
  description: string;
  title: string;
  date?: string;
  template?: string;
  emailTemplate?: any;
  condition?: Record<string, any>;
  to?: string;
  createdBy?: IUserItem;
  status?: string;
  type?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
};
