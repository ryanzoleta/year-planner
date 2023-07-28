import moment from 'moment';

export function generateAllDates(year: number) {
  const allDates: moment.Moment[] = [];

  for (let i = 1; i < 367; i++) {
    const date = moment().dayOfYear(i);

    if (date.year() === year) {
      allDates.push(date);
    }
  }

  return allDates;
}
