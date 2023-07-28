export type CalendarEvent = {
  date: moment.Moment;
  title: string;
  type: 'BIRTHDAY' | 'HOLIDAY' | 'EVENT';
};
