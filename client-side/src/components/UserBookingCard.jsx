import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import ChatBox from '../common/Chat';

const UserBookingCard = ({ user, onPickupTimeAccepted,userData }) => {
  const [amount, setAmount] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const handleAcceptPickupTime = async () => {
    // Perform any necessary actions before accepting pick-up time

    // Example: Update the booking status in the database

    // Notify the parent component about the accepted pick-up time
    setModalOpen(true);

  };
  const closeModal = () => {
    // Add any necessary actions before closing the modal (e.g., cancel the accepted booking)
    setModalOpen(false);
  };
console.log('sdsd',user);
  return (
    <div className="user-booking-card">
      <h3>Booking Details</h3>
      <p>travelID: {user.userId}</p>
      <p>Destination: {user.bookingInfo.destination}</p>
      <p>Pickup Time: {user.bookingInfo.pickupTime}</p>
      <label>
        Amount ₹:
        <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </label>
      <button onClick={handleAcceptPickupTime}>Accept Pickup Time</button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Chat Modal"
      >
        <ChatBox roomId={user.userId} firstmessage={`Booking accepted with amount ${amount} my driver id is ${userData?._id} and my driving license ${userData?.Vehicleno}`}  driverData={userData} CustomerId={user.userId}/>
      </Modal>





    </div>
  );
};

export default UserBookingCard;
