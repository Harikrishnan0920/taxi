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
     <div className='bookingdetails_card' >
     <h5>Booking Details</h5>
     <div className=' book_details'>
<div className='displayFlex justifyContent_spaceEvenly'>
<p>Travel ID: <span> {user.userId}</span></p>
      <p>Destination: <span>{user.bookingInfo.destination}</span></p>
      <p>Pickup Time: <span>{user.bookingInfo.pickupTime}</span></p>
</div>

      <div className=''>
      <div className='driverforms'>
      <div>  Amount ₹:</div>
        <input type="number" className='' placeholder='Enter your Fare' value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button className='booking_btn' onClick={handleAcceptPickupTime}>Accept</button>
      </div>
      
      </div>
     </div>
      

     </div>
     <div className='displayFlex justify_content_center'>
     <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Chat Modal"


      >
        <ChatBox roomId={user.userId} firstmessage={`Booking accepted with amount ${amount} my driver id is ${userData?._id} and my driving license ${userData?.Vehicleno}`}  driverData={userData} CustomerId={user.userId} setModalOpen={setModalOpen} amount={amount}/> 
      </Modal>
     </div>





    </div>
  );
};

export default UserBookingCard;
