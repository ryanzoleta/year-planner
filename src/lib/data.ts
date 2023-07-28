import moment from 'moment';
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
  events: [] as CalendarEvent[]
};
