import React, { Component } from 'react';
import './yearmonthpicker.css';
import {Button} from "reactstrap"

var mL = [
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
var mS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
];

export default class datemonthpicker extends Component {
  state = {
    month: 10,
    year: 2019
  };

  onMonthClick = month => {
    this.setState({ month });
  };

  onBack = () => {
    this.setState({ year: this.state.year - 1 });
  };

  onNext = () => {
    this.setState({ year: this.state.year + 1 });
  };

  onSelect = () => {
    this.props.onSelect(this.state);
  };

  render() {
    return (
      <div className="yearmonthpicker">
        <div className="year-section">
          <div className="year-div">{this.state.year}</div>
          <span className="icon-group">
            <i className="fas fa-angle-left" onClick={this.onBack} />
            <i className="fas fa-angle-right" onClick={this.onNext} />
          </span>
        </div>
        <div className="month-wrapper">
          {mS.map((name, i) => {
            return (
              <button
                className={`month-tab ${i === this.state.month && 'active'}`}
                onClick={() => this.onMonthClick(i)}
              >
                {name}
              </button>
            );
          })}
        </div>
        <div className="button-section">
          <Button color="info" onClick={this.onSelect}>Select</Button>
        </div>
      </div>
    );
  }
}
