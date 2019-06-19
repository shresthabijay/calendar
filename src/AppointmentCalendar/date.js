import Moment from 'moment';
import { extendMoment } from 'moment-range';

let defaultDateFormat = 'YYYY-MM-DD';
let moment = extendMoment(Moment);

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
export const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export const dateRangeForMonth = date => {
  let startOfMonth = moment(date).startOf('month');
  let endOfMonth = moment(date).endOf('month');
  let firstDayOfMonth = startOfMonth.clone().day();
  let dateToIncludeAtFront = moment(date)
    .subtract(1, 'months')
    .endOf('month')
    .subtract(firstDayOfMonth - 1, 'days');
  let lastDayOfMonth = endOfMonth.clone().day();
  let dateToIncludeAtBack = moment(date)
    .add(1, 'months')
    .startOf('month')
    .add(6 - lastDayOfMonth, 'days');
  let range = moment.range(dateToIncludeAtFront, dateToIncludeAtBack);
  let rangeArray = Array.from(range.by('days'));
  return rangeArray;
};

export const weekRange = (startdate, weeks) => {
  let endDate = startdate.clone().add(7 * weeks - 1, 'days');
  let range = Array.from(moment.range(startdate, endDate).by('days'));
  return range;
};

export const dayRange = (startdate, days) => {
  let endDate = startdate.clone().add(days - 1, 'days');
  let range = Array.from(moment.range(startdate, endDate).by('days'));
  return range;
};

export const findFirstSunday = date => {
  let firstSundayOfTheMonth = date
    .clone()
    .startOf('months')
    .day(0);

  if (firstSundayOfTheMonth.month() < date.month()) {
    firstSundayOfTheMonth = date.startOf('months').day(0 + 7);
  }
  return firstSundayOfTheMonth;
};
