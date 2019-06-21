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

export const checkIfTwoTimeSlotOverlaps = (timeSlot1, timeSlot2) => {
  // timeslot has start and end time//

  // this function checks if the two given timeslots have intersection and returns intersection timeslot//
  if (
    timeSlot1.end.isAfter(timeSlot2.start) &&
    timeSlot1.start.isBefore(timeSlot2.end)
  ) {
    // checking the condition to decide which start and end time to use for intersection timeslot //

    /* first Condtion */
    // timeslot1:     s---------   //
    // timeslot2: s-------------   //
    if (timeSlot1.start.isSameOrAfter(timeSlot2.start)) {
      /* sub condition */
      // timeslot1:     s---------E   //
      // timeslot2: s---------E   //
      if (timeSlot1.end.isSameOrAfter(timeSlot2.end)) {
        return {
          start: timeSlot1.start,
          end: timeSlot2.end
        };
      }
      /* sub condition */
      // timeslot1:     s---------E   //
      // timeslot2: s-----------------E   //
      else {
        return {
          start: timeSlot1.start,
          end: timeSlot1.end
        };
      }
    }
    /* second Condtion */
    // timeslot1: s-----------   //
    // timeslot2:     s-------  //
    else if (timeSlot1.start.isSameOrBefore(timeSlot2.start)) {
      /* sub condition */
      // timeslot1: s-----------E   //
      // timeslot2:     s----------E //
      if (timeSlot1.end.isSameOrBefore(timeSlot2.end)) {
        return {
          start: timeSlot2.start,
          end: timeSlot1.end
        };
      }
      /* sub condition */
      // timeslot1: s------------------E   //
      // timeslot2:     s----------E //
      else {
        return {
          start: timeSlot2.start,
          end: timeSlot2.end
        };
      }
    }
  } else {
    /* no overlapping condition */
    return false;
  }
};
