import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import ChatBox from "../common/Chat";
import { Api_url } from "../common/env_variable";

const UserBookingCard = ({ user, onPickupTimeAccepted, userData }) => {
  const [amount, setAmount] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const handleAcceptPickupTime = async () => {
    setModalOpen(true);
  };
  const savepassengerDetails = async () => {
    try {
      const response = await axios.post(Api_url + "/savePassengerData", {
        userId: sessionStorage.getItem("uID"),
        isbusy: true,
        passengerid: user.userId,
        amount: amount,
      });

      console.log(response.data.message);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  console.log("sdsd", user);
  return (
    <div className="user-booking-card">
      <div className="bookingdetails_card">
        <h5>Booking Details</h5>
        <div className=" book_details">
          <div className="displayFlex justifyContent_spaceEvenly">
            <p>
              Travel ID: <span> {user.userId}</span>
            </p>
            <p>
              Destination: <span>{user.bookingInfo.destination}</span>
            </p>
            <p>
              Pickup Time: <span>{user.bookingInfo.pickupTime}</span>
            </p>
          </div>

          <div className="">
            <div className="driverforms">
              <div> Amount ₹:</div>
              <input
                type="number"
                className=""
                placeholder="Enter your Fare"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button className="booking_btn" onClick={handleAcceptPickupTime}>
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="displayFlex justify_content_center">
        <Modal isOpen={isModalOpen} contentLabel="Chat Modal">
          <ChatBox
            roomId={user.userId}
            firstmessage={`Booking accepted with amount ${amount} my driver id is ${userData?._id} and my driving license ${userData?.Vehicleno}`}
            driverData={userData}
            CustomerId={user.userId}
            setModalOpen={setModalOpen}
            amount={amount}
            savepassengerDetails={savepassengerDetails}
          />
        </Modal>
      </div>
    </div>
  );
};

export default UserBookingCard;
