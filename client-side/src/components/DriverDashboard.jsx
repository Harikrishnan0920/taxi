import React, { useEffect, useState } from 'react';
import { Api_url } from '../common/env_variable';
import axios from "axios";
import UserBookingCard from './UserBookingCard';
import { fetchUserDetails } from '../common/commonFuntions';

const DriverDashboard = () => {
  
   
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [places, setPlaces] = useState(null);
  const [filterplaces,SetFilterPlaces]=useState(null)
  const [customers,setCustomers]=useState(null)
  const [currentorgin,setCurrentorgin]=useState(null)
  const [userData,SetUserData]=useState([])

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

const handlePickupTimeAccepted = () => {
  // Clear the selected user when pick-up time is accepted
  setSelectedUser(null);

  // Optionally, refetch the user list or update the UI as needed
};



console.log(userData)

 useEffect(()=>{
  AvailableBookingFrom()
  fetchUserDetails(SetUserData)
 },[])
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
    <div className='dashboard'>
       <div>
      <input
        type="text"
        placeholder="Search locations..."
        value={searchInput}
        onChange={handleSearch}
      />
      <div>
        {places&&places.map((div) => (
          <div className='drop-box' key={div}>
            <p onClick={()=>{setSearchInput(div)}}>{div}</p>
          </div>
        ))}
      </div><button onClick={()=>{Viewcustomers(searchInput)}}>View Customers</button>


     {customers?<div>
      <h3>Users from {currentorgin}</h3>
   
        <div className='CustomersContainer'>
        {customers.map((user) => (
          <div  className='C-list' onClick={() => handleUserClick(user)}>

            <p>TravelID:{user.userId}</p>
            <p>Destination:{user.bookingInfo.destination}</p>
            <p>Pick Up time:{user.bookingInfo.pickupTime}</p>
            </div>
        ))}
        </div>
    
    </div>:<div className='CustomersContainer'><div className='C-list'>No Travelers in this locations</div></div>}
    {selectedUser && (
        <UserBookingCard
          user={selectedUser}
          onPickupTimeAccepted={handlePickupTimeAccepted}
          userData={userData[0]}
        />
      )}

    </div>
    </div>
  )
}

export default DriverDashboard
