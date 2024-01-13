import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Api_url } from './env_variable';
import { toast } from 'react-toastify';
import axios from "axios";
import { fetchUserDetails } from './commonFuntions';

const ChatBox = ({ roomId ,firstmessage,booked,setBooked,driverData,handleDeleteCustomer,setModalOpen,setuserDatasFetch}) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [firstSend, setFirstSend] = useState(firstmessage?true:false);
  const [finalPayment,SetFinalpayment]=useState("")
  useEffect(() => {
    let newSocket = io('http://localhost:8000');

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
      newSocket.emit('joinRoom', { roomId });
    });

    newSocket.on('message', (data) => {
      console.log('Received message:', data);
      debugger
      if(booked==false && data?.text?.includes("Booking accepted with amount")){
       
        setBooked(true)
        updateBooking(data.text)
      }
      



      setMessages((prevMessages) => [...prevMessages, data]);
    });


    newSocket.on('disconnect', (message) => {
      console.log(message);
 
    });
  
     

    setSocket(newSocket);

    if (firstSend) {
      setNewMessage(firstmessage);
      sendMessage();
      // Update state to false after sending the first message
    }

    // Clean up the socket connection when the component unmounts
    return () => newSocket.disconnect();
  }, [roomId]);

  const sendMessage = (initial,cancelMessage) => {
    // Send a message to the server
    if (socket) {
      debugger
    socket.emit('message', { roomId, text:cancelMessage?cancelMessage:driverData?'Driver: '+newMessage:'Passenger '+newMessage })
    // Clear the input field
    if(firstSend && initial=="initalmessage")setFirstSend(false)
    setNewMessage('');
    }
    if(initial=="Userquit"){
     handleDeleteCustomer()
    }
  };

  const updateBooking = async (bookedby,fromDriver) => {
    try {
      const response = await axios.put(`${Api_url}/updateBooking/${fromDriver?roomId:sessionStorage.getItem("uID")}`, {
        bookedby:bookedby
      });
      debugger
      if(response.data.statusCode==200){
      if(fromDriver){
        setModalOpen(false);
        window.location.reload()
        return 
      }
      fetchUserDetails(setuserDatasFetch)
      }
      console.log(response.data.message);
    } catch (error) {
      if(fromDriver){
        setModalOpen(false);
        window.location.reload()
        return 
      }
      console.error('Error updating booking:', error);
    }
  };


  let removeCustomer = async () => {
    debugger
    if (driverData) {
     updateBooking(null,"cancel")
     return 

    }
  
    
    setBooked(false)
    // Send the message
     sendMessage("Userquit","**Customer Cancelled Booking**");
    
    // After the message is sent, delete the customer

  };

console.log(firstSend);
  return (
    <div className="chat-box">
      <button onClick={()=>{removeCustomer()}}>cancel booking</button>
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index}>{message.text}</div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        readOnly={firstSend}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={()=>{sendMessage("initalmessage")}}>Send</button>{firstSend?"!! Click send to Confirm booking":""}
      <span><input ></input></span>
    </div>
  );
};

export default ChatBox;
// confirm button<-user if click prize of user sent will reciept come  
// input box under negotiote <-user type prize click send button for that  

// <--driver side button comes cofirm prise if confirm confirm 
// <--withnegotiation box give prize 

// <-go to user <confirm confirm 


// confirm <- to who didnot request last 
// input <- to who request last

// confirm <-
// input <-inputs value 
// confirm <-lift it away from user 

// user requested 2000






