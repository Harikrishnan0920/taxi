import React, { useState } from 'react';
import axios from 'axios';

const UserBookingCard = ({ user, onPickupTimeAccepted }) => {
  const [amount, setAmount] = useState('');

  const handleAcceptPickupTime = async () => {
    // Perform any necessary actions before accepting pick-up time

    // Example: Update the booking status in the database

    // Notify the parent component about the accepted pick-up time
    onPickupTimeAccepted();
  };

  return (
    <div className="user-booking-card">
      <h3>Booking Details</h3>
      <p>User: {user.Name}</p>
      <p>Destination: {user.destination}</p>
      <p>Pickup Time: {user.pickupTime}</p>
      <label>
        Amount:
        <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </label>
      <button onClick={handleAcceptPickupTime}>Accept Pickup Time</button>
    </div>
  );
};

export default UserBookingCard;
