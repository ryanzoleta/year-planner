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
      },
      {
        date: moment('2023-05-29'),
        holiday: 'Memorial Day'
      },
      {
        date: moment('2023-07-04'),
        holiday: 'Independence Day'
      },
      {
        date: moment('2023-09-04'),
        holiday: 'Labor Day'
      },
      {
        date: moment('2023-11-23'),
        holiday: 'Thanksgiving'
      },
      {
        date: moment('2023-11-24'),
        holiday: 'Day After Thanksgiving'
      },
      {
        date: moment('2023-12-25'),
        holiday: 'Christmas'
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
      },
      {
        date: moment('2023-04-06'),
        holiday: 'Maundy Thursday'
      },
      {
        date: moment('2023-04-07'),
        holiday: 'Good Friday'
      },
      {
        date: moment('2023-04-08'),
        holiday: 'Black Saturday'
      },
      {
        date: moment('2023-04-10'),
        holiday: 'The Day of Valor'
      },
      {
        date: moment('2023-04-21'),
        holiday: "Eid'l Fitr"
      },
      {
        date: moment('2023-05-01'),
        holiday: 'Labor Day'
      },
      {
        date: moment('2023-06-12'),
        holiday: 'Independence Day'
      },
      {
        date: moment('2023-06-28'),
        holiday: 'Eidul Adha'
      },
      {
        date: moment('2023-08-21'),
        holiday: 'Ninoy Aquino Day'
      },
      {
        date: moment('2023-08-28'),
        holiday: 'National Heroes Day'
      },
      {
        date: moment('2023-11-01'),
        holiday: "All Saint's Day"
      },
      {
        date: moment('2023-11-02'),
        holiday: "All Souls' Day"
      },
      {
        date: moment('2023-11-27'),
        holiday: 'Bonifacio Day'
      },
      {
        date: moment('2023-12-08'),
        holiday: 'Immaculate Conception Day'
      },
      {
        date: moment('2023-12-25'),
        holiday: 'Christmas Day'
      },
      {
        date: moment('2023-12-30'),
        holiday: 'Rizal Day'
      },
      {
        date: moment('2023-12-31'),
        holiday: "New Year's Day"
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
