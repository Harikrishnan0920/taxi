import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Api_url } from './env_variable';

const ChatBox = ({ roomId ,firstmessage,booked,setBooked,driverData,CustomerId,handleDeleteCustomer,setModalOpen}) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [firstSend, setFirstSend] = useState(firstmessage?true:false);
  
  useEffect(() => {
    // Connect to the WebSocket server
    let newSocket = io('http://localhost:8000');

    // Set up event listeners
    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
      // Join the specific room upon connecting
      newSocket.emit('joinRoom', { roomId });
    });

    newSocket.on('message', (data) => {
      // Handle incoming messages
      if(booked && data.includes("Booking accepted")){
        setBooked(true)
        updateBooking()
      }
      



      console.log('Received message:', data);
      setMessages((prevMessages) => [...prevMessages, data]);
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

  const sendMessage = (initial) => {
    // Send a message to the server
    if (socket) {
    socket.emit('message', { roomId, text: newMessage })
    // Clear the input field
    if(firstSend && initial)setFirstSend(false)
    setNewMessage('');
    }
  };

  const updateBooking = async () => {
    try {
      const response = await axios.put(`${Api_url}/updateBooking/${CustomerId}`, {
        bookedby: driverData.id,
      });

      console.log(response.data.message);
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };


  let removeCustomer = async () => {
    if (driverData) {
      return setModalOpen(false);
    }
  
    setNewMessage("**Customer Cancelled Booking**");
  
    // Send the message
    await sendMessage();
  
    // After the message is sent, delete the customer
    await handleDeleteCustomer();
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
    </div>
  );
};

export default ChatBox;
