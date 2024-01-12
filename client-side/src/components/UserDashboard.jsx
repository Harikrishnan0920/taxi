import React, { useState, useCallback, useEffect } from 'react';
import withAuth from '../common/withauth';
import axios from "axios";
import { Api_url } from '../common/env_variable';
import { Link, useLocation, useNavigate } from "react-router-dom";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

const UserDashboard = () => {
  const [value, setValue] = useState("")
  const [originPlaces, setOriginPlaces] = useState([])
  const [time, changeTime] = useState('10:00');
  const [destinationPlaces, setDestinationPlaces] = useState([])
  const [bookingInfo, setBookingInfo] = useState({
    origin: '',
    destination: '',
    pickupTime: '',
  });

  const Navigate = useNavigate();
  const [waitTime, setWaittime] = useState(false)
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBookingInfo((prevBookingInfo) => ({
      ...prevBookingInfo,
      [name]: value,
    }));
  };


  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 3000);
    };
  };

  const handleChangeTime = () => {
    console.log("handleChangeTime", time)
    setBookingInfo((prevBookingInfo) => ({
      ...prevBookingInfo,
      pickupTime: time,
    }));
  }

  const changeOriginDropDown = (ele, e) => {
    e.preventDefault()
    setBookingInfo((prevBookingInfo) => ({
      ...prevBookingInfo, origin: ele,
    }));
    setValue(ele)
    setOriginPlaces(prev => prev = [])
  }

  const changeDestinationDropDown = (ele, e) => {
    e.preventDefault()
    setBookingInfo((prevBookingInfo) => ({
      ...prevBookingInfo, destination: ele,
    }));
    setValue(ele)
    setDestinationPlaces(prev => prev = [])
  }

  const handleChange = async (target) => {
    const reponseplaces = await searchPlaces(target.value)
    reponseplaces.map((ele, idx) => {
      if (target.name == "origin") {
        setOriginPlaces(prev => [...prev, { name: ele.display_name, key: idx }]);
      }
      if (target.name == "destination") {
        setDestinationPlaces(prev => [...prev, { name: ele.display_name, key: idx }]);
      }
    })
  };

  const optimizedFn = useCallback(debounce(handleChange), []);

  const searchPlaces = async (query) => {
    console.log("TYPE VALUES", query)
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
      console.log("RESPONSE", response.data)
      return response.data ?? [];
    } catch (error) {
      console.error('Error fetching places:', error);
      return [];
    }
  };


  const handleBookNow = async () => {
    try {
          await axios
        .post(`${Api_url}/book`, {
         userId:sessionStorage.getItem('uID'),
         orgin:bookingInfo.origin,
         destination:bookingInfo.destination,
          pickupTime: time
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
  return <div className='user_dashboard'>
<div className="container">
<div className='user_dashbg'>
<div className='displayFlex justify_content_end'>
<button className='logoutbtn' onClick={()=>{logOut()}}> Logout</button>
</div>


        {/* Booking Form */}
        <div className='customerforms  row'>
         <div className='col-md-4 forminput'>
         <label className='flexDirection_column displayFlex'>
            Origin:
            <input
              type="text"
              name="origin"
            value={bookingInfo.origin}
            onChange={(e) => { optimizedFn(e.target); handleInputChange(e) }}
            />
          </label>
         
        {originPlaces && originPlaces?.length ?
          <div className='dropdown'>
            {originPlaces && originPlaces.length ? originPlaces.map((place, idx) => {
              console.log(place)
              return <>
                <div className='dropdown-card' onClick={(e) => changeOriginDropDown(place.name, e)} key={place.key}>{place.name}</div>
              </>
            }) : ""}
          </div>
          : ""}
         </div>
         <div className='col-md-4 forminput'>
         <label className='flexDirection_column displayFlex'>
            Destination:
            <input
              type="text"
              name="destination"
              value={bookingInfo.destination}
            onChange={(e) => { optimizedFn(e.target); handleInputChange(e) }}
            />
          </label>

        {destinationPlaces && destinationPlaces?.length ?
          <div className='dropdown'>
            {destinationPlaces && destinationPlaces.length ? destinationPlaces.map((place, idx) => {
              console.log(place)
              return <>
                <div className='dropdown-card' onClick={(e) => changeDestinationDropDown(place.name, e)} key={place.key}>{place.name}</div>
              </>
            }) : ""}
          </div>
          : ""}
         </div>

         <div className='col-md-4 forminput'>
         <label className='flexDirection_column displayFlex'>
            Pickup Time:
          {/* <input
              type="text"
              name="pickupTime"
              value={bookingInfo.pickupTime}
              onChange={handleInputChange}
            /> */}
          <TimePicker onChange={changeTime} value={time} />
          </label>
         </div>

         <div className='col-md-12 justify_content_center displayFlex p-3'> 
         <button className=' ' onClick={handleBookNow}>Book Now</button>
         </div>
        </div>
      </div>
      {waitTime&&<div className='messageBox'>
      <div className='message'>Let's wait till we get a ride!</div>
  <div className='lightmessage'>No user have arived</div>
  {/* Add more message divs as needed */}
</div>}
</div>
    </div>
  
};

export default withAuth(UserDashboard);
