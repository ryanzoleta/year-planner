export type CalendarEvent = {
  id: string;
  date: moment.Moment;
  title: string;
  type: 'BIRTHDAY' | 'HOLIDAY' | 'EVENT';
  editing: boolean;
};
