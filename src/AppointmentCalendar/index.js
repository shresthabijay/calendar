import React, { Component } from 'react';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import {
  monthNames,
  dayNames,
  dateRangeForMonth,
  weekRange,
  findFirstSunday
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
    let i = 0;
    if (this.props.isDayView) {
      this.props.appointmentData.forEach(data => {
        let startTime = data.start.split(':').map(data => {
          return parseInt(data);
        });

        let endTime = data.end.split(':').map(data => {
          return parseInt(data);
        });

        let date1 = moment(data.start, 'HH:mm');
        let date2 = moment(data.end, 'HH:mm');

        if (date1.minute() !== 0 || date1.minute() % 15 !== 0) {
          let adjustedTime = date1.minute() - (date1.minute() % 15) + 15;
          date1.set({ minute: adjustedTime });
        }
        let timeArr = Array.from(
          moment.range(date1, date2).by('minutes', { step: 15 })
        );

        timeArr.pop();

        if (timeSlots.length > 0) {
          timeSlots = [...timeSlots, { type: 'break' }, ...timeArr];
        } else {
          timeSlots = [...timeSlots, ...timeArr];
        }
      });

      timeSlots.forEach(data => {
        if (data.type === 'break') {
          timeSlotCards.push(<div className="timeslot  not-available-card" />);
        } else {
          timeSlotCards.push(
            <div className="timeslot">{data.format('HH:mm').toString()}</div>
          );
        }
      });
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
      availability_field: this.props.availability_field_data,
      location: this.props.selected_location
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

  filterDays = date => {
    let data = this.state.availability_field[
      dayNames[date.day()].toLowerCase()
    ];
    if (data.length === 0) {
      return false;
    } else {
      return true;
    }
  };

  filterFieldsWithLocation = location => {
    let availability_field_copy = JSON.parse(
      JSON.stringify(this.state.availability_field)
    );

    for (let [key, value] of Object.entries(availability_field_copy)) {
      let new_arr = value.filter(data => {
        return data.location.includes(location);
      });
      availability_field_copy[key] = new_arr;
    }

    return availability_field_copy;
  };

  render() {
    let filtered_availability_field = this.filterFieldsWithLocation(
      this.state.location
    );
    let viewbardata = null;
    let dates = null;
    let calendarStyle = null;
    let dayCards = null;
    let dayNamesArr = dayNames.map(d => d);

    if (this.state.view.type === 'month') {
      viewbardata = `${
        monthNames[this.state.date.month()]
      } ${this.state.date.year()}`;
      dates = dateRangeForMonth(this.state.date);
      calendarStyle = { gridTemplateColumns: 'repeat(7,1fr)' };
      dayCards = dates.map(date => {
        let isDisabled =
          date.clone().month() !== this.state.date.clone().month();
        let isCurrent = date.isSame(moment(), 'date');
        let isDayAvailable = this.filterDays(date);
        return (
          <DayCard
            key={date.toString()}
            disabled={isDisabled || !isDayAvailable}
            isCurrent={isCurrent}
            onDayClick={this.onDayClick}
            date={date}
          />
        );
      });
    }

    if (this.state.view.type === 'day') {
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

      dayCards = dayCards = dates.map(date => {
        let isCurrent = date.isSame(moment(), 'date');
        let appointmentData =
          filtered_availability_field[dayNames[date.day()].toLowerCase()];
        return (
          <DayCard
            key={date.toString()}
            isCurrent={isCurrent}
            appointmentData={appointmentData}
            isDayView={true}
            date={date}
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
