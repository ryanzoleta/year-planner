import type { CalendarEvent } from './types';

export const allMonths = [
  { month: 'January', visible: true },
  { month: 'February', visible: true },
  { month: 'March', visible: true },
  { month: 'April', visible: true },
  { month: 'May', visible: true },
  { month: 'June', visible: true },
  { month: 'July', visible: true },
  { month: 'August', visible: true },
  { month: 'September', visible: true },
  { month: 'October', visible: true },
  { month: 'November', visible: true },
  { month: 'December', visible: true }
];

const allHolidays = [
  {
    group: 'US',
    description: 'US Holidays',
    visible: false
  },
  {
    group: 'PH',
    description: 'PH Holidays',
    visible: false
  }
];

export const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const defaultPreferences = {
  layout: '3',
  months: allMonths,
  holidays: allHolidays,
  events: [] as CalendarEvent[]
};
