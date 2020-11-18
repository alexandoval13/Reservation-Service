import React, {useState, useEffect} from 'react';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';
import axios from 'axios';
import moment from 'moment';

const CalendarComponent = (props) => {
  //console.log(props.data.obj);
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [disabledDays, setDisabledDays] = useState({});
  //when start day is selected this object will hold start day and max end day
  //which is day before first booked day after start day
  const [disableOnSelect, setDisabledOnSelect] = useState({});

  //received disabled array data from props and dets {disabledDays} to it
  useEffect(() => {
    setDisabledDays(props.data.obj);
  } );

  //finds index in a sorted array which contains first greater number
  const findIndex = (dateTime) => {
    let arr = props.data.arr;
    let start = 0;
    let end = arr.length - 1;
    while (start < end) {
      let mid = Math.floor((start + end) / 2);
      if (arr[mid] < dateTime) {
        start = mid + 1;
      } else {
        end = mid;
      }
    }
    return end;
  };

  /*
    when start date will be selected
    before end day selection
    program needs to show on window only available end dayes
    available end days are all days from start day to first disabled day
    in order to find end date we need to find next element in props.data.arr
    after start date
  **/
  const OnSelectStartDate = () => {
    let date = startDate.valueOf();
    let index = findIndex(date);
    let obj = {};
    obj.startDate = date;
    obj.endDate = props.data.arr[index];
    setDisabledOnSelect(obj);
  };

  /*
    This function will be invoked everu time start date is changed
    Function sets available date range to object
    and this object will be called during calendar rendering
    during rendering day is not in available days range will be
    shown as disabled on a window
  **/
  useEffect(() => {
    //console.log(startDate.getTime());
    OnSelectStartDate();
    return () => {
      setDisabledOnSelect({});
    };
  }, [startDate]);

  /*
    every time end date is selected program automatically send api request to server and received data about costs
  **/
  useEffect(() => {
    props.endDateClick(startDate, endDate);
  }, [endDate]);


  return (

    <div>
      <DateRangePicker
        //focusedInput={startDate}
        open={open}
        startDate={startDate}
        endDate={startDate}
        numberOfMonths={2}
        block={false}
        small={false}
        anchorDirection={'left'}
        displayFormat={'MM/DD/YYYY'}
        orientation={'horizontal'}
        isDayBlocked={date => disabledDays [date.getTime()] === true ? 'disabled-date' : undefined}
        isDayBlocked={date => disableOnSelect.startDate !== undefined ?
          date.getTime() < disableOnSelect.startDate || date.getTime() > disableOnSelect.endDate ? 'disabled-date' : null : null
        }
      />
    </div>

    // <div className="outer-box">
    //   <DatePicker className = "box-border-start"
    //     selected={startDate}
    //     onChange={date => setStartDate(date)}
    //     selectsStart
    //     startDate={startDate}
    //     endDate={startDate}
    //     minDate={startDate}
    //     monthsShown={2}
    //     //on on render cliend receives data about booked days and those days
    //     //are shown on the window as disabled
    //     dayClassName={date => disabledDays [date.getTime()] === true ? 'disabled-date' : undefined}
    //   />
    //   <DatePicker className = "box-border-end"
    //     selected={endDate}
    //     onChange={date=>setEndDate(date)}
    //     selectsEnd
    //     //on on render cliend receives data about booked days and those days
    //     //are shown on the window as disabled
    //     dayClassName={date => disabledDays [date.getTime()] === true ? 'disabled-date' : undefined}
    //     //when client selects start day
    //     //this shows only available and days as active
    //     dayClassName ={date => disableOnSelect.startDate !== undefined ?
    //       date.getTime() < disableOnSelect.startDate || date.getTime() > disableOnSelect.endDate ? 'disabled-date' : null : null
    //     }
    //     startDate={startDate}
    //     endDate={endDate}
    //     monthsShown={2}
    //     minDate={startDate}
    //   />
    // </div>
  );
};

export default CalendarComponent;