import React, { useState } from 'react';
import withAuth from '../common/withauth';
import axios from "axios";
import { Api_url } from '../common/env_variable';
import { Link, useLocation, useNavigate } from "react-router-dom";



const UserDashboard = () => {
  const [bookingInfo, setBookingInfo] = useState({
    origin: '',
    destination: '',
    pickupTime: '',
  });
  const Navigate = useNavigate();
const [waitTime,setWaittime]=useState(false)
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBookingInfo((prevBookingInfo) => ({
      ...prevBookingInfo,
      [name]: value,
    }));
  };

  const handleBookNow = async () => {

    try {
          await axios
        .post(`${Api_url}/book`, {
         userId:sessionStorage.getItem('uID'),
         orgin:bookingInfo.origin,
         destination:bookingInfo.destination,
         pickupTime:bookingInfo.pickupTime
        })
        .then(async (resp) => {
          if (resp.data.statusCode === 200) {
            sessionStorage.setItem("token",resp.data.token)
             setWaittime(true)
        
          } else{
            toast.error(resp.data.message)
          }
        });
    } catch (error) {
        console.log("err", error);
      }



  };
let  logOut=()=>{
sessionStorage.clear()
Navigate("/")
  }
  return <div className='dashboard'>
<div>
<button onClick={()=>{logOut()}}> LogOut</button>
{waitTime&&<div className='messageBox'>
      <div className='message'>lets wait till we get a ride</div>
  <div style={{backgroundColor: "rgb(155, 123, 26)"}} className='message'>No user have arived</div>
  {/* Add more message divs as needed */}
</div>}

        {/* Booking Form */}
        <div>
          <label>
            Origin:
            <input
              type="text"
              name="origin"
              value={bookingInfo.origin}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Destination:
            <input
              type="text"
              name="destination"
              value={bookingInfo.destination}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Pickup Time:
            <input
              type="text"
              name="pickupTime"
              value={bookingInfo.pickupTime}
              onChange={handleInputChange}
            />
          </label>

          <button onClick={handleBookNow}>Book Now</button>
        </div>
      </div>
    </div>
  
};

export default withAuth(UserDashboard);
