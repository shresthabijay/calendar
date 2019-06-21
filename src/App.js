import React from 'react';
import AppointmentCalendar from './AppointmentCalendar';
import {
  person_availability_fields,
  location_availability_fields
} from './AppointmentCalendar/mockdata';

const App = () => {
  return (
    <div>
      <AppointmentCalendar
        location_availability_field_data={location_availability_fields}
        person_availability_field_data={person_availability_fields}
        selected_service_data={{ label: '123', duration: '30' }}
        timeIncrement={30}
      />
    </div>
  );
};
export default App;
