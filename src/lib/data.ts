import moment from 'moment';
import type { CalendarEvent } from './types';

export const allMonths = [
  { description: 'January', visible: true },
  { description: 'February', visible: true },
  { description: 'March', visible: true },
  { description: 'April', visible: true },
  { description: 'May', visible: true },
  { description: 'June', visible: true },
  { description: 'July', visible: true },
  { description: 'August', visible: true },
  { description: 'September', visible: true },
  { description: 'October', visible: true },
  { description: 'November', visible: true },
  { description: 'December', visible: true }
];

const allHolidays = [
  {
    group: 'US',
    description: 'US Holidays',
    visible: false,
    dates: [
      {
        date: moment('2023-01-02'),
        holiday: "New Year's Day"
      },
      {
        date: moment('2023-01-16'),
        holiday: 'Martin Luther King Jr. Day'
      },
      {
        date: moment('2023-02-20'),
        holiday: "President's Day"
      }
    ]
  },
  {
    group: 'PH',
    description: 'PH Holidays',
    visible: false,
    dates: [
      {
        date: moment('2023-02-24'),
        holiday: 'People Power Revolution'
      }
    ]
  }
];

export const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const defaultPreferences = {
  layout: '3',
  months: allMonths,
  holidays: allHolidays,
  events: [] as CalendarEvent[],
  year: moment().year()
};
