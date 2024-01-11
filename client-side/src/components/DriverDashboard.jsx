import React, { useEffect, useState } from 'react';
import { Api_url } from '../common/env_variable';
import axios from "axios";

const DriverDashboard = () => {
  
   
 
  const [searchInput, setSearchInput] = useState('');
  const [places, setPlaces] = useState(null);
  const [filterplaces,SetFilterPlaces]=useState(null)
  const [customers,setCustomers]=useState(null)
  const [currentorgin,setCurrentorgin]=useState(null)
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

 useEffect(()=>{
  AvailableBookingFrom()
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
      setCustomers(data)
   }
    
  })
  .catch((error) => console.error(error));
      }


  console.warn(places)
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


     {customers&&<div>
      <h3>Users from {currentorgin}</h3>
      <ul>
        {customers.map((user) => (
          <li key={user._id}>
            <p>Email: {user.email}</p>
            <p>Name: {user.Name}</p>
            {/* Add more user information as needed */}
          </li>
        ))}
      </ul>
    </div>}

    </div>
    </div>
  )
}

export default DriverDashboard
