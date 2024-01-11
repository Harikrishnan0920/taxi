import React, { useState } from 'react';
import withAuth from '../common/withauth';
import TimePicker from 'react-time-picker';
const UserDashboard = () => {


  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupTime, setPickupTime] = useState(null);

  const handleBookNow = () => {
    // Implement the logic for booking now
    console.log('Booking Now:', { origin, destination, pickupTime });
  };



  return <div className='dashboard'>
  <div>
    <div>Looking for a Taxi?</div>
    <span>Let's start booking</span>
    <div>
      <label>Origin From:</label>
      <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} />
    </div>
    <div>
      <label>Destination To:</label>
      <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
    </div>
    <div>
          <label>Pickup Time:</label>
          <TimePicker
            onChange={(time) => setPickupTime(time)}
            value={pickupTime}
            disableClock
          />
        </div>
    <button onClick={handleBookNow}>Book Now</button>
  </div>
</div>
  
};

export default withAuth(UserDashboard);
