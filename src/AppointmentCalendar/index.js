import React, { Component } from 'react';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import {
  monthNames,
  dayNames,
  dateRangeForMonth,
  weekRange,
  findFirstSunday,
  checkIfTwoTimeSlotOverlaps
} from './date';

import OutsideClick from './OutsideClick';
import DateMonthPicker from './yearmonthpicker';
import './appointmentCalendar.css';

let moment = extendMoment(Moment);

class DateDropDown extends Component {
  state = {
    showdropdown: false
  };

  toggleDropdownOn = () => {
    this.setState({ showdropdown: true });
  };

  toggleDropdownOff = () => {
    this.setState({ showdropdown: false });
  };

  onSelect = data => {
    this.toggleDropdownOff();
    this.props.onSelect(data);
  };

  render() {
    return (
      <div className="datedropdown">
        <OutsideClick onOutsideClick={this.toggleDropdownOff}>
          <div className="button" onClick={this.toggleDropdownOn}>
            <i className="fas fa-calendar-day" />
          </div>
          {this.state.showdropdown && (
            <div
              style={{
                position: 'absolute',
                background: 'white',
                borderRadius: '5px'
              }}
            >
              <div>
                <DateMonthPicker onSelect={this.onSelect} />
              </div>
            </div>
          )}
        </OutsideClick>
      </div>
    );
  }
}

class DayCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddEvent: false
    };
  }

  onMouseEnter = () => {
    this.setState({ showAddEvent: true });
  };

  onMouseLeave = () => {
    this.setState({ showAddEvent: false });
  };

  onDayClick = () => {
    if (this.props.disabled) {
      return;
    }

    this.props.onDayClick(this.props.date);
  };

  render() {
    let date = moment();
    let timeSlots = [];
    let timeSlotCards = [];
    let dates = [];

    let i = 0;

    /* checking if the calendar is in the day view. If so we need to display appoinment UI */
    if (this.props.isDayView) {
      /* using the filtered availability data for this specific data passed from the props */
      this.props.appointmentData.forEach(data => {
        let date1 = data.start;
        let date2 = data.end;

        //adjusting the start time of the each timeslot to be at 15 min interval//
        if (
          date1.minute() !== 0 &&
          date1.minute() % this.props.timeIncrement !== 0
        ) {
          let adjustedTime =
            date1.minute() -
            (date1.minute() % this.props.timeIncrement) +
            this.props.timeIncrement;
          date1.set({ minute: adjustedTime });
        }

        /* arr of dates between the timeslot with step of 15 min */
        console.log(
          date1.format('HH:mm').toString(),
          '-',
          date2.format('HH:mm').toString()
        );

        let timeArr = Array.from(
          moment
            .range(date1, date2)
            .by('minutes', { step: this.props.timeIncrement })
        );

        timeSlots = [...timeSlots, ...timeArr];

        let currentHour = timeArr[0].hour();
        let currentHourDatesArr = [];

        timeArr.forEach((date, i) => {
          if (currentHour === date.hour()) {
            currentHourDatesArr.push(date);
          } else {
            currentHourDatesArr.push(date);
            dates.push(currentHourDatesArr);
            currentHourDatesArr = [];
            currentHourDatesArr.push(date);
            if (i + 1 < timeArr.length - 1) {
              currentHour = timeArr[i + 1].hour();
            }
          }
        });
      });

      console.log(this.props.serviceDuration);
      timeSlotCards = dates.map((hourData, i) => {
        return (
          <div key={i} className="timeslot-row">
            {hourData.map((date, i) => {
              return (
                <div key={i} className="timeslot">
                  {date.format('HH:mm').toString()} -
                  {date
                    .clone()
                    .add(this.props.serviceDuration, 'minute')
                    .format('HH:mm')
                    .toString()}
                </div>
              );
            })}
          </div>
        );
      });

      console.log(timeSlotCards);
    }

    return (
      <div
        className={`day ${this.props.disabled ? 'disabled' : ''} ${this.props
          .isDayView && 'day-view'}`}
        onClick={this.onDayClick}
      >
        <div className="day-top">
          <span
            className={`date ${this.props.isCurrent &&
              'current'} round-border6`}
          >
            {this.props.date.date()}
          </span>
        </div>
        {!this.props.isDayView && <div className="day-bottom" />}
        {this.props.isDayView && (
          <div className="day-bottom ">
            <div className="wrapper custom-scrollbar">{timeSlotCards}</div>
            <div style={{ height: '20px', zIndex: '1' }} />
          </div>
        )}
      </div>
    );
  }
}

export default class EventCalendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dateDropdown: false,
      date: moment(),
      view: { type: 'month' },
      location_availability_fields: this.props.location_availability_field_data,
      person_availability_fields: this.props.person_availability_field_data,
      service_data: this.props.selected_service_data
    };
  }

  onBack = () => {
    switch (this.state.view.type) {
      case 'month':
        this.setState({ date: this.state.date.clone().subtract(1, 'months') });
        break;
      case 'week':
        this.setState({ date: this.state.date.clone().subtract(7, 'days') });
        break;
      case 'day':
        this.setState({ date: this.state.date.clone().subtract(1, 'days') });
        break;
    }
  };

  onNext = () => {
    switch (this.state.view.type) {
      case 'month':
        this.setState({ date: this.state.date.clone().add(1, 'months') });
        break;
      case 'week':
        this.setState({ date: this.state.date.clone().add(7, 'days') });
        break;
      case 'day':
        this.setState({ date: this.state.date.clone().add(1, 'days') });
        break;
    }
  };

  onTodayClick = () => {
    switch (this.state.view.type) {
      case 'month':
        this.setState({ date: moment() });
        break;
      case 'week':
        this.setState({ date: moment().day(0) });
        break;
      case 'day':
        this.setState({ date: moment() });
        break;
    }
  };

  onViewSelection = e => {
    switch (e.target.id) {
      case 'month':
        this.setState({ view: { type: e.target.id } });
        break;
      case 'week':
        this.setState({
          date: findFirstSunday(this.state.date),
          view: {
            type: e.target.id,
            number: parseInt(e.target.getAttribute('data'))
          }
        });
        break;
      case 'day':
        this.setState({
          view: {
            type: e.target.id,
            number: parseInt(e.target.getAttribute('data'))
          }
        });
        break;
    }
  };

  toggleDateDropdown = () => {
    this.setState({ dateDropdown: !this.state.dateDropdown });
  };

  onSelect = data => {
    this.setState({
      date: moment({ year: data.year, month: data.month, day: 1 })
    });
  };

  onDayClick = date => {
    this.setState({
      view: {
        type: 'day',
        number: 1
      },
      date: date
    });
  };

  filterDays = (date, filteredAvailabiltyField) => {
    let data = filteredAvailabiltyField[dayNames[date.day()].toLowerCase()];
    if (data.length === 0) {
      return false;
    } else {
      return true;
    }
  };

  filterAvailabilityFields = (
    location_availability_fields,
    person_availability_fields
  ) => {
    let filtered_availability_field = {};

    Object.keys(location_availability_fields).forEach(day => {
      filtered_availability_field[day] = [];
      person_availability_fields[day].forEach(timeslot1 => {
        location_availability_fields[day].forEach(timeslot2 => {
          let intersectingTimeSlot = checkIfTwoTimeSlotOverlaps(
            timeslot1,
            timeslot2
          );

          if (intersectingTimeSlot) {
            filtered_availability_field[day].push(intersectingTimeSlot);
          }
        });
      });
    });

    return filtered_availability_field;
  };

  render() {
    // let firstST = moment('09:20', 'HH:mm');
    // let firstET = moment('12:50', 'HH:mm');
    // let secondST = moment('09:00', 'HH:mm');
    // let secondET = moment('12:50', 'HH:mm');

    // let timeslot1 = { start: firstST, end: firstET };
    // let timeslot2 = { start: secondST, end: secondET };

    // let timeslot = checkIfTwoTimeSlotOverlaps(timeslot1, timeslot2);

    /* deep cloning data for further processing */

    let locationData = JSON.parse(
      JSON.stringify(this.state.location_availability_fields)
    );
    let personData = JSON.parse(
      JSON.stringify(this.state.person_availability_fields)
    );

    /* changing "HH:mm" format start and end string in availability data to moment object */

    Object.keys(locationData).forEach(day => {
      locationData[day].forEach((timeslotData, i) => {
        let start = moment(timeslotData.start, 'HH:mm');
        let end = moment(timeslotData.end, 'HH:mm');
        locationData[day][i].start = start;
        locationData[day][i].end = end;
      });
    });

    /* changing "HH:mm" format start and end string in availability data to moment object */

    Object.keys(personData).forEach(day => {
      personData[day].forEach((timeslotData, i) => {
        let start = moment(timeslotData.start, 'HH:mm');
        let end = moment(timeslotData.end, 'HH:mm');
        personData[day][i].start = start;
        personData[day][i].end = end;
      });
    });

    /* getting actual service availability data by interesecting timeslots of both location and person availabilty data */
    let filteredAvailabiltyField = this.filterAvailabilityFields(
      locationData,
      personData
    );

    /* UI related logic for rendering different vies of calendar */
    let viewbardata = null;
    let dates = null;
    let calendarStyle = null;
    let dayCards = null;
    let dayNamesArr = dayNames.map(d => d);

    /* for month view */
    if (this.state.view.type === 'month') {
      viewbardata = `${
        monthNames[this.state.date.month()]
      } ${this.state.date.year()}`;
      dates = dateRangeForMonth(this.state.date);
      calendarStyle = { gridTemplateColumns: 'repeat(7,1fr)' };

      /* creating array of card UI to show in the calendar */
      dayCards = dates.map(date => {
        /* checking if this date is of the same month */
        let isDisabled =
          date.clone().month() !== this.state.date.clone().month();

        /* checking if this is the current month */
        let isCurrent = date.isSame(moment(), 'date');

        /*checking if there is any available timeslots for the service for this particular day */
        let isAppointmentAvailable = this.filterDays(
          date,
          filteredAvailabiltyField
        );

        return (
          <DayCard
            key={date.toString()}
            disabled={isDisabled || !isAppointmentAvailable}
            isCurrent={isCurrent}
            onDayClick={this.onDayClick}
            timeIncrement={this.props.timeIncrement}
            date={date}
          />
        );
      });
    }

    /* logic for the day view where appointment timeslots is shown*/
    if (this.state.view.type === 'day') {
      /* creating array of dates for showing in the day view */
      /* for appoinment calendar it's just one day */
      dates = Array.from(
        moment
          .range(
            this.state.date.clone(),
            this.state.date.clone().add(this.state.view.number - 1, 'days')
          )
          .by('days')
      );

      let startingDate = dates[0];
      let endDate = dates[dates.length - 1];
      let startingMonth = monthNames[parseInt(startingDate.month())].substring(
        0,
        3
      );
      let endMonth = monthNames[parseInt(endDate.month())].substring(0, 3);
      calendarStyle = {
        gridTemplateColumns: `repeat(${this.state.view.number},1fr)`
      };
      dayNamesArr = [];

      for (let i in dates) {
        dayNamesArr.push(
          dayNames[parseInt(dates[i].day().toString())].substring(0, 3)
        );
      }

      viewbardata =
        dates.length !== 1
          ? `${startingMonth} ${startingDate.date()} - ${endMonth} ${endDate.date()}, ${endDate.year()}`
          : `${startingMonth} ${startingDate.date()}, ${endDate.year()}`;

      /* creating array of card UI to show in the calendar */
      dayCards = dayCards = dates.map(date => {
        /* checking if this is the current date */
        let isCurrent = date.isSame(moment(), 'date');

        /* getting data of the availabilty for the specific day */
        let appointmentData =
          filteredAvailabiltyField[dayNames[date.day()].toLowerCase()];

        return (
          <DayCard
            key={date.toString()}
            isCurrent={isCurrent}
            appointmentData={appointmentData}
            serviceDuration={this.props.selected_service_data.duration}
            isDayView={true}
            date={date}
            timeIncrement={this.props.timeIncrement}
            onDayClick={this.onDayClick}
          />
        );
      });
    }

    return (
      <div className="appointment-calendar">
        <div className="inner-wrapper tealShade">
          <div className="calendar-body">
            <div className="viewbar">
              <div
                className="today-button round-border6"
                onClick={this.onTodayClick}
              >
                Today
              </div>
              <div className="current-view-time">
                <i className="fas fa-angle-left" onClick={this.onBack} />
                <i className="fas fa-angle-right" onClick={this.onNext} />
                <span className="unselectable">{viewbardata}</span>
                <span>
                  <DateDropDown onSelect={this.onSelect} />
                </span>
              </div>
              <div className="view-selection">
                <div
                  className={`view-button ${this.state.view.type === 'month' &&
                    'active'}`}
                  id="month"
                  onClick={this.onViewSelection}
                >
                  Month
                </div>
                <div
                  className={`view-button ${this.state.view.type === 'day' &&
                    this.state.view.number === 1 &&
                    'active'}`}
                  id="day"
                  data="1"
                  onClick={this.onViewSelection}
                >
                  Day
                </div>
              </div>
            </div>
            <div className="top" style={calendarStyle}>
              {dayNamesArr.map(name => {
                return (
                  <div key={name} className="day-names">
                    {name.substring(0, 3)}
                  </div>
                );
              })}
            </div>
            <div className="bottom" style={calendarStyle}>
              {dayCards}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
