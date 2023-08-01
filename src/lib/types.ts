export type CalendarEvent = {
  id: string;
  date: moment.Moment;
  endDate: moment.Moment;
  title: string;
  type: 'BIRTHDAY' | 'HOLIDAY' | 'EVENT';
  editing: boolean;
  color: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'gray';
};
