import React, { useEffect, useState } from 'react';
import { Api_url } from '../common/env_variable';
import axios from "axios";
import UserBookingCard from './UserBookingCard';
import { fetchUserDetails } from '../common/commonFuntions';
import withAuth from '../common/withauth';
import ChatBox from '../common/Chat';
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";

const DriverDashboard = () => {
  
   
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [places, setPlaces] = useState(null);
  const [filterplaces,SetFilterPlaces]=useState(null)
  const [customers,setCustomers]=useState(null)
  const [currentorgin,setCurrentorgin]=useState(null)
  const [userData,SetUserData]=useState([])
  const[openChat,setOpen]=useState(false)
  const [records,setRecords]=useState([])
 const AvailableBookingFrom=async ()=>{
    await axios.get(Api_url+'/bookedorgins')
    .then((response) =>{
    if(response.data.statusCode==200){
      SetFilterPlaces(response.data.data)
      setPlaces(response.data.data)
   }
    
  })
  .catch((error) => console.error(error));
 }

 const handleUserClick = (user) => {
 
  setSelectedUser(user);
};
const Navigate = useNavigate();
const handlePickupTimeAccepted = () => {
  // Clear the selected user when pick-up time is accepted
  setSelectedUser(null);

  // Optionally, refetch the user list or update the UI as needed
};



console.log(userData)

 useEffect(()=>{
  AvailableBookingFrom()
  fetchUserDetails(setdriverData)
 },[])

 const setdriverData=(data)=>{
 debugger 
SetUserData(data)
console.log(data)
if(data[0].isbusy=="true"){
setOpen(true)
}
}

let  logout=()=>{
  sessionStorage.clear();
  Navigate("/login")}


  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchInput(searchTerm);

    // Filter divs based on the search input
    const filtered = filterplaces.filter((place) =>
    place.toLowerCase().includes(searchTerm)
    );
    if(filtered.length==0){
    setPlaces(filterplaces)
    }
    setPlaces(filtered);
    
  };
  



  let Viewcustomers=async(origin)=>{
    setCurrentorgin(origin)
    await axios.get(Api_url+'/usersByOrigin/'+origin)
    .then((response) =>{
    if(response.data.statusCode==200){
      setCustomers(response.data.data)
   }
    
  })
  .catch((error) => console.error(error));
  }

  
    
  
  console.warn(customers)
  return (
    <div className='user_dashboard'>
    <div className="container">
  <div className='user_dashbg'>
  <div className='driverforms row'>
  <div className="col-md-10">
  <input
      type="text"
      placeholder="Search locations..."
      value={searchInput}
      onChange={handleSearch}
    />
  </div>
   <div className='col-md-2'>
<button onClick={()=>{Viewcustomers(searchInput)}}>View Customers</button>
   </div>

   <div className='col-md-6 availablelocate'>
    <h5>Available Locations</h5>
    

    <div className='available_scroll'>
  <label>
    {places && places.map((div) => (
      <div className={`addressbox ${div === searchInput ? 'active' : ''}`} key={div}>
        <div for="" className='drop-box'>
          <p onClick={() => { setSearchInput(div) }}>{div}</p>
        </div>
      </div>
    ))}
  </label>
</div>

       
        
    </div>
  
  <div className="col-md-6 user_addressbox">
  {customers?<div>
    <h5>Users from {currentorgin}</h5>
 
      <div className='userscroll'>
      {customers.map((user) => (
        <div  className='C-list' onClick={() => handleUserClick(user)}>

          <p>Travel ID: <span>{user.userId}</span></p>
          <p>Destination: <span>{user.bookingInfo.destination}</span></p>
          <p>Pick Up time: <span>{user.bookingInfo.pickupTime}</span></p>
          </div>
      ))}
      </div>
  
  </div>: <div className='notravellers'>No Travelers in this locations</div>}

  </div>

 

  </div>
 
  </div>
  <div className="row">
  <div className="col-md-12 ">
{selectedUser && (
      <UserBookingCard
        user={selectedUser}
        onPickupTimeAccepted={handlePickupTimeAccepted}
        userData={userData[0]}
      />
    )}
</div>
  </div>

  <Modal
        isOpen={openChat}
      
        contentLabel="Chat Modal"
      ><div><ChatBox  roomId={userData[0]?.["passengerid"]} driverData={userData[0]} amount={userData[0]?.amount} setdriverData={setdriverData} logged={true }/></div>
</Modal>
    </div>


   
  </div>
  )
}

export default withAuth(DriverDashboard)
