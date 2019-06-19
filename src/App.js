import React from 'react';
import AppointmentCalendar from './AppointmentCalendar';
import { availability_fields } from './AppointmentCalendar/mockdata';

const App = () => {
  return (
    <div>
      <AppointmentCalendar
        availability_field_data={availability_fields}
        selected_location="123"
      />
    </div>
  );
};
export default App;
